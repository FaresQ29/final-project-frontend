import './Home.css'
import AuthModal from './Authentication/AuthModal'
export default function Home(){
    return (
        <div id="home-container">

            <h1>CommunitySync</h1>
            <AuthModal />
        </div>
    )
}