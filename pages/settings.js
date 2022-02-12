import { getSession, signOut } from "next-auth/react";
import axios from "axios";
import { useState, useEffect } from "react";

const Settings = ({ user }) => {
  const { businessId, userId, role } = user;
  const [business, setBusiness] = useState(null);
  const [password, setPassword] = useState("");
  const [wantKick, setWantKick] = useState(null);
  const [resign, setResign] = useState(false);
  const [changeRole, setChangeRole] = useState(false);
  const [nextOwner, setNextOwner] = useState(null);
  const [deleteAcc, setDeleteAcc] = useState(false);

  useEffect(async () => {
    try {
      const res = await axios.get("/api/data/business");
      const { business: businessData } = res.data;
      setBusiness(businessData);
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }
  }, []);

  const handleKick = async () => {
    try {
      const res = await axios.post("/api/settings", {
        inputPass: password,
        businessId,
        employeeId: wantKick.userId,
        employeeEmail: wantKick.email,
      });
      console.log(res.data.msg);
      console.log(`You have kicked ${wantKick.name}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
      // throw new Error(err.response?.data.msg);
    }
  };

  const handleResign = async () => {
    try {
      await axios.post("/api/settings", {
        inputPass: password,
        businessId,
        employeeId: userId,
        employeeEmail: user.email,
      });
      signOut({ callbackUrl: `${window.location.origin}/` });
    } catch (err) {
      console.log(err);
      // throw new Error(err.response?.data.msg);
    }
  };

  const handleDeleteAcc = async () => {
    try {
      await axios.post("/api/delete", {
        inputPass: password,
        businessId,
      });
      signOut({ callbackUrl: `${window.location.origin}/` });
    } catch (err) {
      console.log(err);
      // throw new Error(err.response?.data.msg);
    }
  };

  const handleRole = async () => {
    console.log("Change Role!");
    try {
      const res = await axios.post("/api/role", {
        inputPass: password,
        businessId,
        ownerId: userId,
        ownerEmail: user.email,
        employeeId: nextOwner.userId,
        employeeEmail: nextOwner.email,
      });
      console.log(res.data.msg);
      console.log(`You switched the role`);
      signOut({ callbackUrl: `${window.location.origin}/` });
      window.location.reload();
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

        <img src={user.image} alt={`${user.name}'s profile picture`} />

        <button
          onClick={() => {
            signOut({ callbackUrl: `${window.location.origin}/` });
          }}
        >
          Sign Out
        </button>
        <br />

        <h2>Your Business Info</h2>

        <br />

        {business && (
          <>
            <p>Name</p>
            <p>{business.name}</p>
            <br />

            <p>Phone Number</p>
            <p>{business.phone}</p>
            <br />

            <p>Email</p>
            <p>{business.email}</p>
            <br />

            <p>Team</p>
            <ul>
              {business.team
                .sort((a, b) => {
                  if (a == b) return 0;
                  return a.role > b.role ? -1 : 1;
                })
                .map((member) => {
                  return (
                    <li key={member.userId}>
                      <br />
                      <img
                        src={member.picture}
                        alt={`${member.name}'s profile picture`}
                      />
                      <p>
                        {member.name}: {member.role}
                      </p>
                      {role === "Owner" &&
                        member.role === "Owner" &&
                        business.team.length > 1 && (
                          <button onClick={() => setChangeRole(true)}>
                            Change Role
                          </button>
                        )}
                      {role === "Owner" &&
                        member.role === "Owner" &&
                        business.team.length === 1 && (
                          <button onClick={() => setDeleteAcc(true)}>
                            Delete Business Account
                          </button>
                        )}
                      {role === "Owner" && member.role === "Employee" && (
                        <button onClick={() => setWantKick(member)}>
                          Kick Employee
                        </button>
                      )}
                      {role === "Employee" && member.userId === userId && (
                        <button onClick={() => setResign(true)}>Resign</button>
                      )}
                    </li>
                  );
                })}
            </ul>
          </>
        )}

        {wantKick && (
          <div>
            <p>Please input the company password to kick {wantKick.name}</p>
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

        {resign && (
          <div>
            <p>Please input the company password to resign</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button onClick={handleResign}>Resign</button>
            <button onClick={() => setResign(false)}>Cancel</button>
          </div>
        )}

        {deleteAcc && (
          <div>
            <p>
              Please input the company password to delete the whole business
              account
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button onClick={handleDeleteAcc}>Delete</button>
            <button onClick={() => setResignDeleteAcc(false)}>Cancel</button>
          </div>
        )}

        {changeRole && (
          <div>
            <p>
              Please set the next owner and input the company password to change
              role into Employee
            </p>

            {business.team.map((member) => {
              if (member.role === "Employee")
                return (
                  <li
                    key={member.userId}
                    style={
                      nextOwner?.userId === member.userId
                        ? { backgroundColor: "#aaaaaa" }
                        : { backgroundColor: "transparent" }
                    }
                  >
                    <p>{member.name}</p>
                    <button onClick={() => setNextOwner(member)}>Select</button>
                  </li>
                );
            })}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button onClick={handleRole}>Change</button>
            <button
              onClick={() => {
                setChangeRole(false);
                setNextOwner(null);
              }}
            >
              Cancel
            </button>
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

  return {
    props: { user: session.user },
  };
}
