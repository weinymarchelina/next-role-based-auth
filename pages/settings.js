import { getSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";

const Settings = ({ user, business }) => {
  const { businessId, userId } = user;

  const [password, setPassword] = useState("");
  const [wantKick, setWantKick] = useState(null);

  getBusiness(businessId, setBusiness);

  const handleKick = async () => {
    try {
      const res = await axios.post("/api/settings", {
        ownerId: userId,
        ownerPass: password,
        businessName: business.name,
        businessId: businessId,
        employeeId: wantKick.userId,
      });
      console.log(res.data.msg);
      console.log(`You have kicked ${wantKick.name}`);
    } catch (err) {
      console.log(err);
      // throw new Error(err.response?.data.msg);
    }
  };

  return (
    <div className="body">
      <div className="middle">
        <h1>Settings</h1>
        <br />

        <h2>Personal Info</h2>

        <p>Name</p>
        <p>{user.name}</p>
        <br />

        <p>Email</p>
        <p>{user.email}</p>
        <br />

        <img src={user.picture} alt={`${user.name}'s profile picture`} />

        <br />

        <h2>Your Business Info</h2>

        <br />

        <p>Name</p>
        <p>{business.name}</p>
        <br />

        <p>Phone Number</p>
        <p>{business.phone}</p>
        <br />

        <p>Email</p>
        <p>{business.email}</p>
        <br />

        {/* <p>Team</p>
        <ul>
          {business.team.map((member) => {
            return (
              <li key={member.userId}>
                <p>
                  {member.name}: {member.role}
                </p>
                {role === "Owner" && member.role === "Employee" && (
                  <button onClick={() => setWantKick(member)}>
                    Kick Employee
                  </button>
                )}
              </li>
            );
          })}
        </ul> */}

        {wantKick && (
          <div>
            <p>Please input your password to kick {wantKick.name}</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button onClick={handleKick}>Kick</button>
            <button onClick={() => setWantKick(null)}>Cancel</button>
          </div>
        )}

        <br />
      </div>
    </div>
  );
};

export default Settings;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const res = await axios.post("/api/data/business", {
      businessId: session.businessId,
    });
    const { business } = res.data;
    return {
      props: { business, user: session.user },
    };
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
}
