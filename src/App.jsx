import {Route, Routes} from 'react-router-dom';
import Nav from './Components/Nav/Nav';
import { AuthProviderWrapper } from './Context/auth.context';
import { CommProviderWrapper } from './Context/communities.context';
import Home from './Pages/Home/Home'
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import Chat from './Pages/Chat/Chat';
import Communities from './Pages/Communities/Communities'
import IsPrivate from './Components/PageVisibility/isPrivate';
import IsAnon from './Components/PageVisibility/isAnon';
import FindUsers from './Pages/FindUsers/FindUsers';
import EditPage from './Pages/EditPage/EditPage';
import UserPage from './Pages/UserPage/UserPage';
import CommunityPage from './Pages/Communities/CommunityPage';
export default function App(){
    return (
        <AuthProviderWrapper>
            <CommProviderWrapper >
                <Nav />
                <Routes>
                    <Route path="/" element={<IsAnon><Home/></IsAnon>  } />
                    <Route path="/profile" element={<IsPrivate> <ProfilePage/> </IsPrivate>} />
                    <Route path="/chat" element={<IsPrivate> <Chat/> </IsPrivate>} />
                    <Route path="/communities" element={<IsPrivate> <Communities/> </IsPrivate>} />
                    <Route path="/communities/:id" element={<IsPrivate> <CommunityPage/> </IsPrivate>} />
                    <Route path="/find-users" element={<IsPrivate> <FindUsers/> </IsPrivate>} />
                    <Route path="/edit-user" element={<IsPrivate> <EditPage/> </IsPrivate>} />
                    <Route path="/user/:id" element={<IsPrivate> <UserPage/> </IsPrivate>} />
                </Routes>
            </CommProviderWrapper>
        </AuthProviderWrapper>
    )
}

