import React from 'react';
import { SideNav } from './SideNav';

const Layout = (props) => {
    return (
        <div className={"relative flex md:flex-row flex-col mt-0 gap-8 md:gap-16 z-10 " + props.className}>
            <SideNav />
            {props.children}
        </div>
    );
};

export default Layout;