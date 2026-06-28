import { useAuth } from '../context/AuthContext';
import IndustryProfile from '../components/profile/IndustryProfile';
import CommunityProfile from '../components/profile/CommunityProfile';

export default function Profile() {
  const { user } = useAuth();
  console.log("user.userType:", user?.userType, user);


  if (user?.userType === "company") return <IndustryProfile />;
  return (<CommunityProfile />);
}


