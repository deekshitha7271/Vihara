const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const hostAppSchema = new mongoose.Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            status: String,
            propertyName: String,
            submittedAt: Date
        }, { collection: 'hostapplications' });

        // Use lowercase 'hostapplications' if your collection name is strictly that, 
        // or rely on Mongoose pluralization. The user earlier saw "duplicate key error collection: test.hostapplications"
        // so the collection name is definitely 'hostapplications'.

        const HostApplication = mongoose.models.hostApplication || mongoose.model('hostApplication', hostAppSchema);
        const User = mongoose.models.user || mongoose.model('user', new mongoose.Schema({ email: String, role: String, username: String }));

        console.log("\n--- USERS ---");
        const users = await User.find({});
        users.forEach(u => console.log(`ID: ${u._id}, Email: ${u.email}, Role: ${u.role}`));

        console.log("\n--- HOST APPLICATIONS ---");
        const apps = await HostApplication.find({});
        if (apps.length === 0) console.log("No applications found.");

        for (const app of apps) {
            console.log(`\nApp ID: ${app._id}`);
            console.log(`  User ID Ref: ${app.userId}`);
            console.log(`  Status: ${app.status}`);
            console.log(`  Property: ${app.propertyName}`);

            const linkedUser = await User.findById(app.userId);
            console.log(`  Linked User Found? ${linkedUser ? 'YES' : 'NO'}`);
            if (linkedUser) {
                console.log(`  Linked User Email: ${linkedUser.email}`);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
