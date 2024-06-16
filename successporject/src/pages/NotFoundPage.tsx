import { Link } from "react-router-dom"

export default function NotFoundPage (){
  return (
    <div>
        NotFoundPage
        <Link to='/'>Home from Link</Link>
        <a href="/">Home from A</a>
    </div>
  )
}
