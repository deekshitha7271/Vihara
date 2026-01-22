const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const hostAppSchema = new mongoose.Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            status: String,
            propertyName: String
        }, { collection: 'hostapplications' });
        const HostApplication = mongoose.models.hostApplication || mongoose.model('hostApplication', hostAppSchema);

        const userSchema = new mongoose.Schema({ username: String, email: String, role: String }, { collection: 'users' });
        const User = mongoose.models.user || mongoose.model('user', userSchema);

        const apps = await HostApplication.find({});
        console.log(`\nTotal Applications: ${apps.length}`);

        for (const app of apps) {
            console.log(`--------------------------------------------------`);
            console.log(`App ID: ${app._id}`);
            console.log(`Status: ${app.status}`);
            console.log(`Property Name: ${app.propertyName}`);
            console.log(`User ID Ref: ${app.userId}`);

            const user = await User.findById(app.userId);
            if (user) {
                console.log(`User Found: ${user.username} (${user.email}) - Role: ${user.role}`);
            } else {
                console.log(`User NOT FOUND for ID: ${app.userId}`);
            }
        }
        console.log(`--------------------------------------------------`);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
