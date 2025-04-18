import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/Navbar";

<Navbar />


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const handleSignup = async () => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate unique referral code
    const code = email.slice(0, 3).toUpperCase() + Math.floor(Math.random() * 1000);

    let initialPoints = 0;

    if (referralCode) {
      // Check if referral code exists and is not self-referral
      const refQuery = await getDoc(doc(db, "referrals", referralCode));
      if (refQuery.exists() && refQuery.data().userId !== user.uid) {
        // Add points to referrer
        const refUserDoc = doc(db, "users", refQuery.data().userId);
        await setDoc(refUserDoc, { points: 10 }, { merge: true });
        initialPoints = 5;
      }
    }

    // Save user with referral code
    await setDoc(doc(db, "users", user.uid), {
      email,
      points: initialPoints,
      referralCode: code,
      rewards: [],
      referrals: []
    });

    // Map referral code to user
    await setDoc(doc(db, "referrals", code), {
      userId: user.uid,
    });

    alert("Signup Successful");
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <input value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="Referral Code (Optional)" />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
