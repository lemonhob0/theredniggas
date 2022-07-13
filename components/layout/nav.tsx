import * as React from 'react'
import Style from 'styles/layout/nav.module.scss'
import Link from 'next/link'
const Nav:React.FunctionComponent = () =>{

    return <nav className={Style.nav}>
        <ul>
            <Link href={'/'}><li>home</li></Link>
            <Link href={'/users'}><li>users</li></Link>
            <Link href={'/courses'}><li>courses</li></Link>
            <Link href={'/practices'}><li>practices</li></Link>
        </ul>
    </nav>

}
export default Nav