import { FaFlagCheckered } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { FaBullhorn, FaRocket, FaCalculator, FaChartPie } from 'react-icons/fa';
export const CampaignItems = [
    {
        icon: <FaFlagCheckered className="text-xl" /> ,
        title: 'Campaign'
    },
    {
        item: 'List',
        path: '/campaigns/list'
    },
    {
        item: 'Performance',
        path: '/campaigns/performance'
    },
    // {
    //     item: 'Create Campaign',
    //     path: '/campaigns/create'
    // },
    {
        item: 'Analytics',
        path: '/campaigns/analytics'
    }
]

export const LeadsItems = [
    {
        icon: <IoPersonAdd className="text-xl"/> ,
        title: 'Leads',
    },
    {
        item: 'List',
        path: '/leads/list',
    },
    {
        item: 'Sources',
        path: '/leads/sources',
    },
    // {
    //     item: 'Scoring',
    //     path: '/leads/scoring',
    // },
    // {
    //     item: 'Qualification',
    //     path: '/leads/qualification',
    // }
]

export const MarketingItems = [
    {
        icon: <FaRocket className="text-xl"/> ,
        title: 'Marketing'
    },
    {
        item: 'Activity Log',
        path: '/marketing/activity-log',
    },
    {
        item: 'Create Activity',
        path: '/marketing/create-activity',
    },
    {
        item: 'Activity Analytics',
        path: '/marketing/activity-analytics',
    },
]

export const RoiItems = [
    {
        icon: <FaCalculator className="text-xl"/> ,
        title: 'ROI Analysis'
    },
    {
        item: 'ROI Dashboard',
        path: '/roiAnalysis/roi-dashboard',
    },
    // {
    //     item: 'Revenue Breakdown',
    //     path: '/roiAnalysis/breakdown',
    // },
    // {
    //     item: 'Conversion Rate Analysis',
    //     path: '/roiAnalysis/conversion',
    // },
    // {
    //     item: 'Cost vs Profit',
    //     path: '/roiAnalysis/costprofit',
    // }
]

export const ReportItems = [
    {
        icon: <FaChartPie className="text-xl"/> ,
        title: 'Report'
    },
    {
        item: 'Lead Reports',
        path: '/reports/lead-report',
    },
    {
        item: 'Campaign Reports',
        path: '/reports/campaign-report',
    },
    {
        item: 'Custom Reports',
        path: '/reports/custom-report',
    },
    {
        item: 'Download Data',
        path: '/reports/download',
    }
]
