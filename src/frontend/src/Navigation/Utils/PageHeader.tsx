import React from 'react';

// The page header
export function PageHeader({pageName}) {
    return (
        <header>
            <div className="p-1 text-md-start">
                <h1>{pageName}</h1>
            </div>
        </header>
    );
}