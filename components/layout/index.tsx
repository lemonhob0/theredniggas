import * as  React from 'react'
import Nav from './nav'
interface Props {
    children:React.ReactNode
}
const Layout: React.FunctionComponent<Props> = ({children}) =>{
    return <>
        <Nav/>
        {children}
    </>
}
export default Layout