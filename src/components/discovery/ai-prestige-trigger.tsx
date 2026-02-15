'use client';

import React from 'react';

interface AIPrestigeTriggerProps {
    children: React.ReactNode;
    className?: string;
}

export function AIPrestigeTrigger({ children, className }: AIPrestigeTriggerProps) {
    const handleClick = () => {
        window.dispatchEvent(new CustomEvent('open-prestige-curator'));
    };

    return (
        <button onClick={handleClick} className={className}>
            {children}
        </button>
    );
}
