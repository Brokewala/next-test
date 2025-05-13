"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { deleteCookie } from './saveToken';

const ButtonNavigate = ({ children, path, className, deconnect = false }: { children: React.ReactNode; path: string; className?: string, deconnect?: boolean }) => {
    const router = useRouter();

    const clickBtn = () => {
        if (deconnect) {
            deleteCookie();
            router.push(path)
        } else {
            router.push(path)
        }
    }

    if (deconnect) {
        return (
            <div onClick={() => clickBtn()} className={`cursor-pointer ${className}`}>
                {children}
            </div>
        );
    } else {
        return (
            <Link href={path} className={`cursor-pointer ${className}`}>
                {children}
            </Link>
        )
    }
}

export default ButtonNavigate;