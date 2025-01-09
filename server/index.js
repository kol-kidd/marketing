  const express = require('express');
  const mysql = require('mysql2');
  const cors = require('cors');
  const axios = require('axios');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt'); // Import bcrypt
  const cron = require('node-cron');
  require('dotenv').config();
  const secretKey = process.env.secretKey;
  const WebSocket = require('ws');
  const http = require('http');

  const app = express();

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
  ]

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Reject the request
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods if needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
    credentials: true, // Allow cookies if needed
  }));

  app.use(express.json());

  const port = process.env.PORT || 5000;

  // Create an HTTP server using Express
  const server = http.createServer(app);

  // Create WebSocket server using the same HTTP server
  const wss = new WebSocket.Server({ port: 5001 }, () => {
    console.log('WebSocket server started on ws://localhost:5001');
  });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket server');
    
    // Handle messages from clients
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });

  });

  const broadcastUpdatedData = (endpoint, type) => {
    axios.get(endpoint)
      .then(response => {
        // const dataToSend = Array.isArray(response.data) ? response.data[0] : response.data;
        // console.log('Data to send:', dataToSend);
        
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: type,
              data: response.data
            }));
          }
        });
      })
      .catch(err => {
        console.error(`Error fetching updated ${type}:`, err);
      });
  };

  // MySQL connection setup
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin54321',
    database: 'marketing',
    connectTimeout: 10000,
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }else{
      console.log('Connected to MySQL');
    }
  });

  //Automatic update the status from campaign if end-date passed the current date
  const updateStatusIfEnded = () => {
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in 'YYYY-MM-DD' format
    
    const query = 'UPDATE campaign SET status = "ended" WHERE end_date < ? AND status != "ended"';
    
    db.query(query, [currentDate], (err, result) => {
      if (err) {
        console.error('Error updating campaign status:', err);
      } else {
        console.log(`${result.affectedRows} campaigns updated to "ended"`);
      }
    });
  };

  //query for updating conversion rates
  const updateConversionRateForCampaigns = () => {
    const getCampaignsQuery = 'SELECT campaign_id FROM campaign'; // Fetch all campaigns
    const getTotalLeadsQuery = 'SELECT COUNT(*) AS total_leads FROM leads WHERE campaign_id = ?';
    const getConversionsQuery = `
      SELECT COUNT(*) AS conversions 
      FROM leads 
      INNER JOIN users ON leads.user_id = users.id 
      WHERE leads.campaign_id = ? AND users.score >= 15
    `;
    const updateCampaignQuery = 'UPDATE campaign SET conversion_rate = ? WHERE campaign_id = ?';
  
    // Step 1: Fetch all campaigns
    db.query(getCampaignsQuery, (err, campaigns) => {
      if (err) {
        console.error('Error fetching campaigns:', err);
        return;
      }
  
      // Step 2: Loop through each campaign to calculate its conversion rate
      campaigns.forEach((campaign) => {
        const campaignId = campaign.campaign_id;
  
        // Fetch total leads for the campaign
        db.query(getTotalLeadsQuery, [campaignId], (err, leadsResult) => {
          if (err) {
            console.error(`Error fetching total leads for campaign ${campaignId}:`, err);
            return;
          }
  
          const totalLeads = leadsResult[0].total_leads;
  
          if (totalLeads === 0) {
            console.log(`No leads found for campaign ${campaignId}. Setting conversion rate to 0.`);
            db.query(updateCampaignQuery, [0, campaignId], (err) => {
              if (err) console.error(`Error updating conversion rate for campaign ${campaignId}:`, err);
            });
            return;
          }
  
          // Fetch conversions for the campaign (users with score > 15)
          db.query(getConversionsQuery, [campaignId], (err, conversionsResult) => {
            if (err) {
              console.error(`Error fetching conversions for campaign ${campaignId}:`, err);
              return;
            }
  
            const conversions = conversionsResult[0].conversions;

            // Calculate conversion rate
            const conversionRate = (conversions / totalLeads) * 100;
  
            // Update the campaign table with the conversion rate
            db.query(updateCampaignQuery, [conversionRate, campaignId], (err) => {
              if (err) {
                console.error(`Error updating conversion rate for campaign ${campaignId}:`, err);
              } else {
                console.log(`Campaign ${campaignId} updated with conversion rate: ${conversionRate.toFixed(2)}%`);
              }
            });
          });
        });
      });
    });
  };

  // Run every midnight to check and update campaign statuses
  cron.schedule('0 0 * * *', updateStatusIfEnded);

  //generate campaign_id
  const generateCampaignID = async () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT campaign_id FROM campaign ORDER BY id DESC LIMIT 1';
      db.query(query, (err, results) => {
        if(err) {
          return reject(err);
        }

        let newCampaignId = 'CAM001';
        if(results.length > 0) {
          const lastCampaignId = results[0].campaign_id;
          const lastNumber = parseInt(lastCampaignId.replace('CAM', ''));
          const nextNumber = lastNumber + 1;
          newCampaignId = `CAM${nextNumber.toString().padStart(3, '0')}`;
        }

        resolve(newCampaignId);
      })
    })
  }

  // Get all campaigns and update status if needed
  app.get('/campaign/get', async (req, res) => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      // Update campaign status if the end_date is passed
      await new Promise((resolve, reject) => {
        const query = 'UPDATE campaign SET status = "ended" WHERE end_date < ? AND status != "ended"';
        db.query(query, [currentDate], (err, result) => {
          if (err) {
            return reject(err);
          }
          console.log(`${result.affectedRows} campaigns updated to "ended"`);
          resolve();
        });
      });

      const query = 'SELECT * FROM campaign';
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error getting data from campaign:', err);
          return res.status(500).json({ message: 'Error fetching data from campaign' });
        }

        const campaignWithTokens = results.map((camp) => {
          const token = jwt.sign(
            { campaignId: camp.campaign_id, id: camp.id },
            secretKey,
            { expiresIn: '1h' }
          );
          return { ...camp, token };
        });

        res.json(campaignWithTokens);
      });
    } catch (err) {
      console.error('Error during campaign status update:', err);
      return res.status(500).json({ message: 'Error updating campaign status' });
    }
  });

  //get specific campaign data
  app.get('/campaign/get/:id', async(req, res) => {
    const campId = req.params.id;
    const query =`SELECT campaign_id, campaign_name, campaign_desc, start_date, end_date, budget, status, leads_generated, engagement_rate, conversion_rate, age_range, location, interest FROM campaign WHERE campaign_id = ?`;

    db.query(query, [campId], (err, results) => {
      if(err){
        console.error('Error executing query:', err);
        return res.status(500).json({message: 'Error fetching data'});
      }

      if(results.length === 0) {
        return res.status(404).json({message: 'Campaign not found'});
      }

      res.json(results[0]);
    })
  })

  //update campaign data
  app.put('/campaign/edit/:id', async(req,res) => {
    const id = req.params.id;
    const updatedData = req.body;

    const { 
      campaign_name, 
      campaign_desc, 
      budget, 
      status,
      engagement_rate,
      age_range, 
      location, 
      interest} = updatedData;

      try{
        const currentTimestamp = new Date().toISOString().slice(0, 23).replace('T', ' ');

        const query = `UPDATE campaign 
        SET campaign_name = ?, 
        campaign_desc = ?, 
        budget = ?, 
        status = ?,
        engagement_rate = ?,  
        age_range = ?, 
        location = ?, 
        interest = ?, 
        updatedAt = ? 
        WHERE campaign_id = ?`;

        db.query(query, [
          campaign_name,
          campaign_desc,
          budget,
          status,
          engagement_rate,
          age_range,
          location,
          interest,
          currentTimestamp,
          id
        ], (err, result) => {
          if(err){
            console.error('Error query: ', err);
            return res.status(500).send({message: 'Error query!', error: err});
          }
          res.status(200).send({
            message: 'Campaign updated successfully!',
            campaign_id: id,
          });
        })
      }catch(err){
        console.error('Error update: ', err);
        return res.status(500).send({message: 'Error updating campaign!', error: err});
      }    
  });

  //add campaign data
  app.post('/campaign/add', async (req, res) => {
    const {
      campaign_name, 
      campaign_desc, 
      start_date, 
      end_date, 
      budget, 
      status,
      age_range,
      location,
      interest } = req.body;

      if(
          !campaign_name 
        || !campaign_desc 
        || !start_date 
        || !end_date 
        || !budget 
        || !status 
        || !age_range 
        || !location 
        || !interest){
        return res.status(400).send({message: 'Missing required fields'});
      }

      try{
        const campaignId = await generateCampaignID();

        const currentTimestamp = new Date().toISOString().slice(0, 23).replace('T', ' ');

        const query = 'INSERT INTO campaign (campaign_id, campaign_name, campaign_desc, start_date, end_date, budget, status, age_range, location, interest, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, 
          [
            campaignId, 
            campaign_name,
            campaign_desc, 
            start_date, 
            end_date, 
            budget, 
            status,
            age_range, 
            location, 
            interest, 
            currentTimestamp, 
            currentTimestamp], (err, result) => {
            if(err) {
              console.error('Error query: ', err);
              return res.status(500).send({message: 'Error adding campaign', error: err});
            }

            res.status(200).send({
              message: 'Campaign added successfully',
              campaign_id: campaignId,
              campaign_name: campaign_name,
              id: result.insertId
            });
        });
        
      }catch(error){
        res.status(500).send({message: 'Error generating campaign ID', error});
      }
  });

  //delete campaign data
  app.delete('/campaign/delete/:id', (req, res) => {
    const id = req.params.id; // Get the campaign ID from the request parameters
    const query = 'DELETE FROM campaign WHERE campaign_id = ?';

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Error deleting campaign', error: err });
      }
      res.status(200).json({ message: 'Campaign deleted successfully' });
    });
  });

  //get total for metrics from campaign
  app.get('/campaign/metrics', async (req, res) => {
    const query = `
      SELECT 
        (SUM(c.engagement_rate) / 100) / COUNT(c.engagement_rate) AS total_engagement_rate, 
        (SUM(c.conversion_rate) / 100) / COUNT(c.conversion_rate) AS total_conversion_rate, 
        COUNT(l.lead_id) AS total_leads_generated,
        YEAR(l.createdAt) AS year,
        MONTH(l.createdAt) AS month,
        COUNT(DISTINCT c.campaign_id) AS total_campaigns
      FROM campaign c
      LEFT JOIN leads l ON c.campaign_id = l.campaign_id
      GROUP BY YEAR(l.createdAt), MONTH(l.createdAt)
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error fetching metrics' });
      }
      
      // Emit WebSocket message after fetching data
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'metrics', 
            data: results
          }));
        }
      });
  
      res.json(results);
    });
  });
  
  // Fetch campaign bar chart data
  app.get('/campaign/barChartData', async (req, res) => {
    const query = `
      SELECT 
        campaign_id,
        campaign_name,
        start_date,
        end_date,
        conversion_rate,
        engagement_rate,
        leads_generated
      FROM campaign
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error fetching metrics' });
      }
      
      // Emit WebSocket message after fetching data
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'barChartData', 
            data: results
          }));
        }
      });

      res.json(results);
    });
  });

  // Fetch campaign line chart data
  app.get('/campaign/lineChartData', async (req, res) => {
    const query = `
      SELECT campaign_id, 
       DATE(createdAt) AS lead_date, 
       COUNT(lead_id) AS number_of_leads
      FROM leads
      GROUP BY campaign_id, lead_date
      ORDER BY campaign_id, lead_date;
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error fetching metrics' });
      }
      
      // Emit WebSocket message after fetching data
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'lineChartData',
            data: results
          }));
        }
      });

      res.json(results);
    });
  });

  //add new leads (for mockup only)
  app.post('/leads/add', (req, res) => {
    const { campaign_id, user_id, selected_option } = req.body;

    // Check if the lead already exists
    const checkQuery = `
      SELECT * FROM leads 
      WHERE campaign_id = ? AND user_id = ?
    `;
    db.query(checkQuery, [campaign_id, user_id], (err, results) => {
      if (err) {
        console.error('Error checking lead:', err);
        return res.status(500).send('Error checking lead existence');
      }

      if (results.length > 0) {
        return res.status(400).send('Lead with this email already exists for this campaign');
      }

      // Insert the new lead
      const insertQuery = `
        INSERT INTO leads (campaign_id, user_id, source_id, status, createdAt)
        VALUES (?, ?, ?, ?, NOW())
      `;
      db.query(insertQuery, [campaign_id, user_id, selected_option, 'New'], (err, result) => {
        if (err) {
          console.error('Error inserting lead:', err);
          return res.status(500).send('Error adding lead');
        }

        // Update campaign leads_generated count
        const updateCampaignQuery = `
          UPDATE campaign 
          SET leads_generated = IFNULL(leads_generated, 0) + 1
          WHERE campaign_id = ?
        `;

        db.query(updateCampaignQuery, [campaign_id], (err) => {
          if (err) {
            console.error('Error updating campaign:', err);
            return res.status(500).send('Error updating campaign');
          }
        });

        // Update source lead_count
        const updateSourceQuery = `
          UPDATE sources 
          SET lead_count = IFNULL(lead_count, 0) + 1 
          WHERE source_id = ?
        `;
        db.query(updateSourceQuery, [selected_option], (err) => {
          if (err) {
            console.error('Error updating source:', err);
            return res.status(500).send('Error updating source');
          }
        });

        // Update user score
        const countLeadsQuery = `
          SELECT COUNT(*) AS lead_count 
          FROM leads 
          WHERE user_id = ?
        `;
        db.query(countLeadsQuery, [user_id], (err, results) => {
          if (err) {
            console.error('Error counting leads for user:', err);
            return res.status(500).send('Error updating user score');
          }

          const leadCount = results[0].lead_count;

          if (leadCount >= 1) {
            // Calculate score increment for the user
            const increment = (leadCount - 1) * 5;

            const updateScoreQuery = `
              UPDATE users 
              SET score = IFNULL(score, 0) + ?
              WHERE id = ?
            `;
            db.query(updateScoreQuery, [increment, user_id], (err) => {
              if (err) {
                console.error('Error updating user score:', err);
                return res.status(500).send('Error updating user score');
              }

              // Call the function to broadcast the updated data
              broadcastUpdatedData('http://localhost:5000/campaign/metrics', 'metrics');  
              broadcastUpdatedData('http://localhost:5000/campaign/barChartData', 'barChartData');  
              broadcastUpdatedData('http://localhost:5000/campaign/lineChartData', 'lineChartData'); 
              updateConversionRateForCampaigns();


              return res.status(201).send('Lead added, campaign, source, and score updated successfully');
            });
          } else {
            return res.status(201).send('Lead added, campaign and source updated, but no score update needed');
          }
        });
      });
    });
  });

  //register user (mockup)
  app.post('/register', async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
      const date = new Date();
      console.log('hashed:', hashedPassword)

      const query = 'INSERT INTO users (name, email, phone, password, createdAt) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [name, email, phone, hashedPassword, date], (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ error: 'Server error. Please try again later.' });
        } else {
          res.status(200).json({ message: 'User registered successfully!' });
        }
      });
    } catch (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  });

  //login user (mockup)
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
      const query = 'SELECT id, name, phone, email, password FROM users WHERE email = ?';
      db.query(query, [email], async (err, results) => {
        if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Exclude password from the response
        const { id, name, phone, email } = user;

        res.status(200).json({
          success: true,
          message: 'Login successful',
          data: { id, name, phone, email },
        });
      });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  //get leads
  app.get('/leads/get', async (req, res) => {
    const query = `
      SELECT leads.*, users.id AS id, users.name, users.phone, users.email, users.score
      FROM leads
      JOIN users ON leads.user_id = users.id
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error getting data from leads:', err);
        return res.status(500).json({ message: 'Error fetching data from leads' });
      }

      const leadsWithUserInfo = results.map((lead) => {
        const token = jwt.sign(
          { campaignId: lead.campaign_id, email: lead.email }, 
          secretKey,
          { expiresIn: '1h' }
        );
        return { 
          ...lead, 
          user_id: lead.user_id,
          user_name: lead.name,
          user_phone: lead.phone,
          user_email: lead.user_email,
          token
        };
      });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'leads', 
            data: results
          }));
        }
      });

      res.json(leadsWithUserInfo); 
    });
  });

  //get specific lead data
  app.get('/leads/get/:id/:email', async (req,res) => {
    const campId = req.params.id;
    const email = req.params.email;

    const query =`SELECT * FROM leads WHERE campaign_id = ? AND email = ?`;

    db.query(query, [campId, email], (err, results) => {
      if(err){
        console.error('Error executing query:', err);
        return res.status(500).json({message: 'Error fetching lead data'});
      }

      if(results.length === 0) {
        return res.status(404).json({message: 'Lead Data not found'});
      }

      res.json(results[0]);
    })
  })

  //delete leads
  app.delete('/leads/delete/:id/:email', async(req,res) => {
    const id = req.params.id;
    const email = req.params.email;

    const query = "DELETE FROM leads WHERE campaign_id = ? AND email = ?";

    db.query(query, [id, email], (err, results) => {
      if(err){
        console.error('Error deleting data:', err);
        return res.status(500).json({message: 'Error deleting lead:', err});
      }
      res.status(200).json({message: 'Lead deleted successfully!'});
    })
  })

  //add source
  app.post('/leads/source/add', async(req, res) => {
    const { source_name } = req.body;

    const query = `INSERT INTO sources (source_name, date_added, last_updated) VALUES (?, NOW(), NOW())`;

    db.query(query, [source_name], (err, result) => {
      if (err) {
        console.error('Error inserting source:', err);
        return res.status(500).send('Error adding source');
      }
      return res.status(201).send('Source added successfully');
    })
  })

  //get lead source
  app.get('/leads/source/get', async (req, res) => {
    const query = "SELECT * FROM sources";

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error getting data from leads:', err);
        return res.status(500).json({ message: 'Error fetching data from leads' });
      }

      res.json(results); 
    });
  });

  //delete lead source
  app.delete('/leads/source/delete/:id', async(req, res) => {
    const id = req.params.id;

    const query = "DELETE FROM sources WHERE source_id = ? ";

    db.query(query, [id], (err, results) => {
      if(err){
        console.error('Error deleting data:', err);
        return res.status(500).json({message: 'Error deleting lead source:', err});
      }
      res.status(200).json({message: 'Lead Source deleted successfully!'});
    })
  })

  //update source data
  app.put('/leads/source/update/:id', async(req,res) => {
    const id = req.params.id;
    const updatedData = req.body;

    const { source_id, source_name} = updatedData;

      try{

        const query = `UPDATE sources
        SET 
        source_name = ?,
        last_updated = ?
        WHERE source_id = ?`;

        const today = new Date();

        db.query(query, [
          source_name,
          today,
          source_id
        ], (err, result) => {
          if(err){
            console.error('Error query: ', err);
            return res.status(500).send({message: 'Error query!', error: err});
          }
          res.status(200).send({
            message: 'Source updated successfully!',
            campaign_id: id,
          });
        })
      }catch(err){
        console.error('Error update: ', err);
        return res.status(500).send({message: 'Error updating source!', error: err});
      }    
  });

  //get data for roi dashboard
  app.get('/roi/dashboard/get', async(req,res) => {
    const query = `
    SELECT 
        campaign_id, 
        campaign_name,
        campaign_desc, 
        start_date, 
        end_date, 
        budget, 
        leads_generated, 
        engagement_rate, 
        conversion_rate,
        location,
        interest 
    FROM campaign;
`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching campaign data:', err);
            return res.status(500).json({ error: 'Failed to fetch campaign data.' });
        }

        // Add calculation for number of customers
        const dataWithCustomers = results.map(campaign => {
            const numberOfCustomers = Math.round(campaign.leads_generated * (campaign.conversion_rate / 100));
            return {
                ...campaign,
                number_of_customers: numberOfCustomers
            };
        });

        res.status(200).json({
            success: true,
            data: dataWithCustomers
        });
    });
  })

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
