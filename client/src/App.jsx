import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate} from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Create from './components/Campaign/create.jsx';
// CAMPAIGN
import Campaignlist from './components/Campaign/CampaignList.jsx'; 
import CampaignAnalytics from './components/Campaign/analytics.jsx';
import CampaignPerfomance from './components/Campaign/performance.jsx';
import _viewCampaign from './components/Campaign/_viewCampaign.jsx';
import _editCampaign from './components/Campaign/_editCampaign.jsx';
// LEADS
import LeadsList from './components/Leads/LeadsList.jsx';
import Qualification from './components/Leads/Qualification.jsx';
import Scoring from './components/Leads/Scoring.jsx';
import Sources from './components/Leads/Sources.jsx';
import _editList from './components/Leads/_editList.jsx';
import _editSource from './components/Leads/_editSource.jsx';
// MARKETING
import ActivityLog from './components/MarketingAct/ActivityLog.jsx'
import ActAnalytics from './components/MarketingAct/ActAnalytics.jsx'
import CreateAct from './components/MarketingAct/CreateAct.jsx'
//ROI ANALYSIS
import Breakdown from './components/ROI/Breakdown.jsx'
import Conversion from './components/ROI/Conversion.jsx'
import CostvProfit from './components/ROI/CostvProfit.jsx'
import ROIDash from './components/ROI/Dashboard.jsx'
//REPORTS
import CampaignReport from './components/Reports/CampaignReport.jsx'
import CustomReport from './components/Reports/CustomReport.jsx'
import Download from './components/Reports/Download.jsx'
import LeadReport from './components/Reports/LeadReport.jsx'
// 
import Menu from './components/Menu/Menu.jsx';
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import { CampaignItems, LeadsItems, MarketingItems, RoiItems, ReportItems } from './constants/menu/index.jsx';
import './App.css'

//Menu Icons
import { MdDashboard } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { Drawer } from "flowbite-react";
import ThemeToggle from './components/ThemeToggle/ThemeToggle.jsx';
import { IoLogOut } from "react-icons/io5";
import { FaCalculator, FaCog, FaQuestion, FaQuestionCircle } from 'react-icons/fa';
//Landing
import Login from './components/Landing/Login.jsx';
//CONTEXT
import { useDataContext } from './Context/DataContext';
import { RxAvatar } from "react-icons/rx";

import axios from 'axios';



function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(
    () => JSON.parse(localStorage.getItem('isMenuOpen')) ?? true // Retrieve saved state or default to true
  );

  const [isMenuOpenSM, setIsMenuOpenSM] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isPathLogin = location.pathname === '/'

   const handleMenuOpen = () => {
    setIsMenuOpen((prevState) => {
      const newState = !prevState;
      localStorage.setItem('isMenuOpen', JSON.stringify(newState));
      return newState;
    });
  };


  const [activeDropdown, setActiveDropdown] = useState(null); 

  const handleDropdownToggle = (dropdownTitle) => {
    setActiveDropdown((prev) => (prev === dropdownTitle ? null : dropdownTitle)); 
  };

  const handleMenuOpenSM = () => {
    setIsMenuOpenSM(!isMenuOpenSM);
  }

  const handleLogout = () => {
    navigate('/')
  }

  const { setMetricData, setLineChartData, setBarChartData } = useDataContext();

  useEffect(() => {
    const fetchData = async () => {
      const lastFetched = localStorage.getItem('lastFetched');
      const currentTime = new Date().getTime();
    
      if (lastFetched && currentTime - lastFetched < 86400000) {
        const storedMetricData = localStorage.getItem('metricData');
        const storedLineChartData = localStorage.getItem('lineChartData');
        const storedBarChartData = localStorage.getItem('barChartData');
    
        if (storedMetricData && storedLineChartData && storedBarChartData) {
          setMetricData(JSON.parse(storedMetricData));
          setLineChartData(JSON.parse(storedLineChartData));
          setBarChartData(JSON.parse(storedBarChartData));
          return;
        }
      }
    
      // Fetch fresh data from the API if no valid cached data
      try {
        const resultsMetrics = await axios.get('http://localhost:5000/campaign/metrics');
        const resultsLineChart = await axios.get('http://localhost:5000/campaign/lineChartData');
        const resultsBarChart = await axios.get('http://localhost:5000/campaign/barChartData');
    
        // Store fresh data in localStorage
        localStorage.setItem('metricData', JSON.stringify(resultsMetrics.data));
        localStorage.setItem('lineChartData', JSON.stringify(resultsLineChart.data));
        localStorage.setItem('barChartData', JSON.stringify(resultsBarChart.data));
        localStorage.setItem('lastFetched', currentTime.toString()); // Store the fetch timestamp
    
        // Set data to context
        setMetricData(resultsMetrics.data);
        setLineChartData(resultsLineChart.data);
        setBarChartData(resultsBarChart.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();  // Fetch data on app load
  }, [setMetricData, setLineChartData, setBarChartData]);

  const {darkMode} = useDataContext();

  useEffect(() => {
    if (darkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); 
  
  return (
    <>
      <div
        className={`app-layout relative grid ${isMenuOpen ? 'grid-cols-[14vw1_auto]' : 'grid-cols-[5vw_auto]'} grid-rows-1 transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-800 dark:text-gray-400`}
      >
        {/* Sidebar */}
        {!isPathLogin &&
          <div
          className={`menu-container shadow-right px-4 hidden xl:block lg:block bg-white relative transition-all duration-300 ease-in-out dark:bg-black`}
        >
          <div className="menu sticky top-0 left-0 flex flex-col dark:border-none dark:border-gray-600 h-dvh z-30">
            <div
              className={`flex w-full ${
                isMenuOpen
                  ? 'justify-between items-center '
                  : 'justify-center items-center'
              } md:text-lg sm:text-md text-center font-bold py-5 dark:text-white`}
            >
              <span className={`${isMenuOpen ? 'text-[1.5vw] dark:text-white bg-gradient-to-t from-cyan-400 to-blue-800 bg-clip-text text-transparent' : 'hidden'}`}>
                MOBILEHUB
              </span>
              <IoMenu
                className={`text-[1.5rem] cursor-pointer`}
                onClick={handleMenuOpen}
              />
            </div>
            <span
              className={`flex items-center ${
                isMenuOpen ? '' : 'hidden'
              } xl:text-sm lg:text-sm w-full p-2 text-base text-nowrap text-gray-500 rounded-lg`}
            >
              MAIN MENU
            </span>
            <Menu 
              title="Dashboard" 
              type="normal" 
              items={<MdDashboard />} 
              isOpen={isMenuOpen}
            />
            <Menu
              title="Campaigns"
              type="dropdown"
              items={CampaignItems}
              isOpen={isMenuOpen}
              handleDropdownToggle={handleDropdownToggle}
              activeDropdown={activeDropdown}
            />
            <Menu
              title="Leads"
              type="dropdown"
              items={LeadsItems}
              isOpen={isMenuOpen}
              handleDropdownToggle={handleDropdownToggle}
              activeDropdown={activeDropdown}
            />
            {/* <Menu
              title="Marketing"
              type="dropdown"
              items={MarketingItems}
              isOpen={isMenuOpen}
              handleDropdownToggle={handleDropdownToggle}
              activeDropdown={activeDropdown}
            /> */}
            <Menu
              title="ROI"
              type="normal"
              items={<FaCalculator/>}
              // items={RoiItems}
              isOpen={isMenuOpen}
              // handleDropdownToggle={handleDropdownToggle}
              // activeDropdown={activeDropdown}
            />
            <Menu
              title="Reports"
              type="dropdown"
              items={ReportItems}
              isOpen={isMenuOpen}
              handleDropdownToggle={handleDropdownToggle}
              activeDropdown={activeDropdown}
            />

            <hr className='border-gray-300 shadow-md mt-[5rem]'/>

            <Menu
                title="Settings"
                type="normal"
                items={<FaCog/>}
                // items={RoiItems}
                isOpen={isMenuOpen}
                // handleDropdownToggle={handleDropdownToggle}
                // activeDropdown={activeDropdown}
              />
              
            <Menu
                title="FAQs"
                type="normal"
                items={<FaQuestionCircle/>}
                // items={RoiItems}
                isOpen={isMenuOpen}
                // handleDropdownToggle={handleDropdownToggle}
                // activeDropdown={activeDropdown}
              />

            <div id="logout" className={`h-full flex  ${isMenuOpen ? 'justify-end' : 'justify-center'} items-end`}>
              <div className={`flex gap-2 items-center p-2 rounded-lg cursor-pointer`} onClick={handleLogout}>
                {isMenuOpen ? <span>Logout</span> : ''}
                <IoLogOut className='text-[2rem]' />
              </div>
            </div>
          </div>
        </div>
        }
          {/* Main Content */}
        <div className={`${isPathLogin ? '' : 'w-dvw xl:w-full lg:w-full h-fit gap-5 flex flex-col z-0'}`}>
          {!isPathLogin && 
          <header className="border w-dvw xl:w-full lg:w-full shadow-md dark:border-gray-600 dark:border-t-black dark:bg-black flex px-10 py-5 sticky top-0 z-10 bg-white">
            <div className="flex gap-5">
              <div
                className={`flex items-center xl:hidden lg:hidden text-[25px]`}
                onClick={handleMenuOpenSM}
              >
                <IoMenu />
              </div>
              <div className="searchBar w-[350px] rounded-sm border border-gray-300 px-5 py-3 text-gray-400">Search</div>
            </div>
            <div className="profile w-full flex justify-end items-center gap-5">
              <ThemeToggle />
              <RxAvatar className='text-3xl'/>
            </div>
          </header>   
          }
          <div className={`page-content ${isPathLogin ? '' : ' mx-5 h-full px-1 py-2'} `}>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* CAMPAIGN ROUTES */}
            {/* <Route path="/campaigns/create" element={<Create />} /> */}
            <Route path="/campaigns/list" element={<Campaignlist />} />
            <Route path="/campaigns/performance" element={<CampaignPerfomance />} />
            <Route path="/campaigns/analytics" element={<CampaignAnalytics />} />
            <Route path="/campaigns/list/view/:token" element={<_viewCampaign />} />
            <Route path="/campaigns/list/edit/:token" element={<_editCampaign />} />
            
            {/* LEAD ROUTES */}
            <Route path="/leads/list" element={<LeadsList/>} />
            <Route path="/leads/sources" element={<Sources />} />
            {/* <Route path="/leads/scoring" element={<Scoring />} />
            <Route path="/leads/qualification" element={<Qualification />} /> */}
            <Route path="/leads/list/edit/:token" element={<_editList />} />
            
            {/* MARKETING ROUTES */}
            <Route path="/marketing/activity-log" element={<ActivityLog />} />
            <Route path="/marketing/create-activity" element={<CreateAct />} />
            <Route path="/marketing/activity-analytics" element={<ActAnalytics />} />
            
            {/* ROI ROUTES */}
            <Route path="/roiAnalysis/roi-dashboard" element={<ROIDash />} />
            {/* <Route path="/roiAnalysis/breakdown" element={<Breakdown />} />
            <Route path="/roiAnalysis/conversion" element={<Conversion />} />
            <Route path="/roiAnalysis/costprofit" element={<CostvProfit />} /> */}
            
            {/* REPORT ROUTES */}
            <Route path="/reports/campaign-report" element={<CampaignReport />} />
            <Route path="/reports/custom-report" element={<CustomReport />} />
            <Route path="/reports/download" element={<Download />} />
            <Route path="/reports/lead-report" element={<LeadReport />} />

            <Route path="*" element={<NotFound/>} />
          </Routes>
          </div>
        </div> 
      </div>
      <ToastContainer autoClose={2000} />
      <Drawer open={isMenuOpenSM} onClose={handleMenuOpenSM} 
      placement="top" 
      responsive={{
        sm: "left",
        md: 'left',
      }}>
        <Drawer.Header title="Menu" />
        <Drawer.Items>
            <Menu title='Dashboard' type="normal" items={<MdDashboard className={`text-xl ${isMenuOpen ? 'text-[25px]' : 'text-[50px] rounded-lg border p-2'}`}/>} isOpen={isMenuOpen}
            handleDropdownToggle={handleDropdownToggle}
            activeDropdown={activeDropdown} />    
            <Menu title='Campaigns' type="dropdown" items={CampaignItems} isOpen={isMenuOpen}
            handleDropdownToggle={handleDropdownToggle}
            activeDropdown={activeDropdown} />
            <Menu title='Leads' type="dropdown" items={LeadsItems} isOpen={isMenuOpen}
            handleDropdownToggle={handleDropdownToggle}
            activeDropdown={activeDropdown} />
            <Menu title='Marketing'  type="dropdown"items={MarketingItems} isOpen={isMenuOpen}
            handleDropdownToggle={handleDropdownToggle}
            activeDropdown={activeDropdown} />
            <Menu title='ROI Analysis' type="dropdown" items={RoiItems} isOpen={isMenuOpen}
            handleDropdownToggle={handleDropdownToggle}
            activeDropdown={activeDropdown} />
            <Menu title='Reports' type="dropdown" items={ReportItems} isOpen={isMenuOpen}
            handleDropdownToggle={handleDropdownToggle}
            activeDropdown={activeDropdown} />
        </Drawer.Items>
      </Drawer>
    </>
    
  )
}

export default App
