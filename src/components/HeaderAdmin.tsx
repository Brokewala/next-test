import React from 'react';
import Text from './ui/text';
import Link from 'next/link';


const HeaderAdmin = () => {
    return (
        <div className='w-full h-16 p-4 flex flex-row justify-between items-center gap-4 border-b border-zinc-200 shadow-sm'>
            <Link href={"/"}>
                <Text format='h1' weight='800'>E-Commerce Admin</Text>
            </Link>
            <div className='flex flex-row justify-end items-center gap-12'>
                <div className='flex flex-row justify-end items-center gap-4'>
                    <Text format='p'>Mes clients</Text>
                </div>
                <div className='w-8 h-8 rounded-full bg-violet-400'></div>
            </div>
        </div>
    );
}

export default HeaderAdmin;
