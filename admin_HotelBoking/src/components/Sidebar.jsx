import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});
    const [collapsed, setCollapsed] = useState(false); 

    const toggleMenu = (index) => {
        setOpenMenus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const sidebarLinks = [
        {
            name: 'Dashboard',
            path: '/',
            icon: assets.dashboardIcon,
        },
        {
            name: 'Tour',
            icon: assets.dashboardIcon,
            children: [
                { name: 'List Tour', path: '/list-tour', icon: assets.addIcon },
                { name: 'Add Tour', path: '/add-tour', icon: assets.listIcon },
            ],
        },
        {
            name: 'Room',
            icon: assets.listIcon,
            children: [
                { name: 'List Room', path: '/list-room', icon: assets.addIcon },
                { name: 'Add Room', path: '/add-room', icon: assets.listIcon },
            ],
        },
    ];

    return (
        <div className={`h-full border-r border-gray-300 transition-all duration-300 bg-white
      ${collapsed ? 'w-16' : 'w-64'} flex flex-col text-sm`}>

            <div className="p-3 flex justify-end">
                <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-black">
                    {collapsed ? '➡️' : '⬅️'}
                </button>
            </div>

            <nav className="flex flex-col gap-1">
                {sidebarLinks.map((link, index) => (
                    <div key={index}>
                        {link.children ? (
                            <div
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100
        ${location.pathname === link.path ? 'bg-gray-200 font-medium' : ''}`}
                                onClick={() => toggleMenu(index)}
                            >
                                <img src={link.icon} alt="icon" className="w-5 h-5" />
                                {!collapsed && <span>{link.name}</span>}
                                {!collapsed && (
                                    <span className="ml-auto text-xs">{openMenus[index] ? '▲' : '▼'}</span>
                                )}
                            </div>
                        ) : (
                            <Link
                                to={link.path}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100
        ${location.pathname === link.path ? 'bg-gray-200 font-medium' : ''}`}
                            >
                                <img src={link.icon} alt="icon" className="w-5 h-5" />
                                {!collapsed && <span>{link.name}</span>}
                            </Link>
                        )}

                        {link.children && openMenus[index] && (
                            <div className="pl-10 flex flex-col gap-1 transition-all duration-300">
                                {link.children.map((child, childIndex) => (
                                    <Link
                                        key={childIndex}
                                        to={child.path}
                                        className={`flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-100
              ${location.pathname === child.path ? 'bg-gray-100 text-blue-600 font-medium' : ''}`}
                                    >
                                        <img src={child.icon} alt="icon" className="w-4 h-4" />
                                        {!collapsed && <span>{child.name}</span>}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

            </nav>
        </div>
    );
};

export default Sidebar;
