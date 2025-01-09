import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { Drawer } from 'flowbite-react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

function Menu({ title, items, type, isOpen, handleDropdownToggle, activeDropdown }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [icon, setIcon] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 

  const toggleDropdown = (type, title) => {
    if (type === 'dropdown' && isOpen) {
      setIsDropdownOpen(!isDropdownOpen);
      handleDropdownToggle(title);    
    } else if(type === 'normal'){
      navigateTo(title);
    }
  };

  useEffect(() => {
    if (type === 'dropdown') {
      const firstItem = items.slice(0, 1)[0];
      setIcon(firstItem.icon);
    } else {
      setIcon(items);
    }
  }, [items, type]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    handleDropdownToggle((prevState) => !prevState);
  };

  useEffect(() => {
    setIsDropdownOpen(activeDropdown === title);
  }, [activeDropdown, title]);

  const navigateTo = (title) => {
    if(title === 'Dashboard'){
      navigate('/dashboard');
    }else if(title === 'ROI'){
      navigate('/roiAnalysis/roi-dashboard')
    }else if(title === 'Settings'){
      navigate('#')
    }
  };

  const isActive = location.pathname === `/${title.toLowerCase().replace(/\s+/g, '-')}`;
  const isActiveIcon = location.pathname.includes(`/${title.toLowerCase()}`);

  return (
    <>
      <div className={`${isOpen ? '' : 'flex justify-center'}`}>
        <li className="list-none min-h-[40px]">
          <button
            type="button"
            className={`flex ${isOpen ? '' : 'justify-center'} border-l-[3px] min-h-[40px]  ${isActiveIcon ? 'border-orange-400' : 'border-l-white dark:border-l-black'} rounded-sm items-center w-full p-2 text-base text-gray-900 transition duration-75 group ${isOpen ? 'hover:bg-blue-300 dark:text-white dark:hover:bg-blue-500' : ''} ${isActive  && isOpen? 'text-blue-900' : ''}`}
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
            onClick={() => isOpen ? toggleDropdown(type, title) : toggleDropdown(type, title)}
          >
            {icon &&
              React.cloneElement(icon, { className: `${isOpen ? 'text-[25px]' : `text-[45px] dark:text-white rounded-lg border p-2 hover:bg-blue-400 ${isActiveIcon ? 'bg-blue-300' : ''} ${location.pathname === '/dashboard' && title === 'Dashboard' && 'bg-blue-300'}`}`, onClick: handleDrawer })
            }
            {isOpen && (
              <>
                <span className="flex-1 ms-3 text-left rtl:text-right text-base xl:text-base lg:text-sm whitespace-nowrap">{title}</span>
                {type === 'dropdown' && (
                  isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />
                )}
              </>
            )}
          </button>
          {isOpen && type === 'normal' && 
          <ul id="dropdown-example" className={`py-1 space-y-2 max-h-0 opacity-0 invisible transition-all duration-300 ease-in-out`}>
            <li>
              <div
                className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-500 dark:text-white`}
              >
              </div>
            </li>
        </ul>
          }
          {isOpen && type === 'dropdown' ? (
            <ul id="dropdown-example" className={`py-1 space-y-2 ${isDropdownOpen ? 'max-h-[200px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'} transition-all duration-300 ease-in-out`}>
              {items.slice(1).map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-300 dark:hover:bg-blue-500 dark:text-white ${location.pathname === item.path ? 'bg-blue-300 dark:bg-blue-500 text-blue-950' : ''}`}
                  >
                    {item.item}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            type === 'dropdown' && (
              <Drawer open={isDrawerOpen} onClose={handleDrawer} placement="top" responsive={{ sm: "left", md: 'left' }}>
                <Drawer.Header title={items.map(data => (data.title))} />
                <Drawer.Items>
                  <ul id="dropdown-example" className={`py-1 space-y-2 max-h-[200px] opacity-100 visible transition-all duration-300 ease-in-out`}>
                    {items.slice(1).map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.path}
                          className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-300 dark:text-white dark:hover:bg-gray-700 ${location.pathname === item.path ? 'bg-blue-300 text-blue-950' : ''}`}
                        >
                          {item.item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Drawer.Items>
              </Drawer>
            )
          )}
        </li>
      </div>
    </>
  );
}

export default Menu;
