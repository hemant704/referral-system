import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "../firebase";

const router = useRouter();

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
    }
  });

  return () => unsubscribe();
}, []);

import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

<Navbar />

const rewardsList = [
  { name: "Free eBook", points: 30 },
  { name: "Amazon Coupon", points: 100 },
];

export default function Rewards() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      const u = auth.currentUser;
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        setUser(u);
        setPoints(snap.data().points);
      }
    };
    loadUser();
  }, []);

  const redeem = async (reward) => {
    if (points < reward.points) return alert("Not enough points!");

    const userDoc = doc(db, "users", user.uid);
    const snap = await getDoc(userDoc);
    const data = snap.data();

    await updateDoc(userDoc, {
      points: data.points - reward.points,
      rewards: [...data.rewards, reward.name],
    });

    alert("Reward redeemed!");
    setPoints((prev) => prev - reward.points);
  };

  return (
    <div>
      <h2>Rewards</h2>
      {rewardsList.map((r) => (
        <div key={r.name}>
          <p>{r.name} - {r.points} pts</p>
          <button onClick={() => redeem(r)}>Redeem</button>
        </div>
      ))}
    </div>
  );
}
