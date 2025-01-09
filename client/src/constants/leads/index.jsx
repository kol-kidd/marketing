import { Badge } from "flowbite-react";

export const itemsPerPage = 7;
export const statusBadge = [
    {
        status: 'New',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#90caf9] text-[#1E3A5F]' size='sm'>New</Badge>
    },
    {
        status: 'Contacted',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#26a69a] text-white' size='sm'>Contacted</Badge>
    },
    {
        status: 'Engaged',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#FFA726] text-black' size='sm'>Engaged</Badge>
    },
    {
        status: 'MQL',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#AB47BC] text-white' size='sm'>MQL</Badge>
    },
    {
        status: 'SQL',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#7E57C2] text-white' size='sm'>SQL</Badge>
    },
    {
        status: 'Opportunity',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#FFCA28] text-black' size='sm'>Opportunity</Badge>
    },
    {
        status: 'Converted',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#66BB6A] text-white' size='sm'>Converted</Badge>
    },
    {
        status: 'Disqualified',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#BDBDBD] text-black' size='sm'>Disqualified</Badge>
    },
    {
        status: 'Unresponsive',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#E0E0E0] text-black' size='sm'>Unresponsive</Badge>
    },
    {
        status: 'ClosedLost',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#EF5350] text-white' size='sm'>Closed</Badge>
    },
    {
        status: 'ClosedWon',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#388E3C] text-white' size='sm'>Closed</Badge>
    },
    {
        status: 'ReEngage',
        badge: <Badge className='w-fit px-3 py-1 border rounded-full bg-[#4DD0E1] text-black' size='sm'>ReEngage</Badge>
    },
]