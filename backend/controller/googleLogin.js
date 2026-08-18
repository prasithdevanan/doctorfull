import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import signinModel from "../models/signinModel.js";
import patiendIdModel from "../models/patientId.js";

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/patient/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await signinModel.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        // Create a new user
        const counter = await patiendIdModel.findOneAndUpdate({ name: "patient" }, { $inc: { value: 1 } }, { upsert: true, returnDocument: 'after' });
        const patientId = `PAT${String(counter.value).padStart(6, '0')}`;


        const newUser = await signinModel.create({
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            image: profile.photos?.[0]?.value,
            patientId
        });
        return done(null, newUser);
    } catch (error) {
        console.log(error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await signinModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;

