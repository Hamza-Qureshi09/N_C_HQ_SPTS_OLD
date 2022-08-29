const activityModel = require("../models/Activity")

class Activity {

    // adding activity
    async AddNewActivity(req, res) {
        const { Class, ActivityTitle, ActivityDate, ActivityDescription } = req.body;
        if (Class) {
            await activityModel({
                Title: ActivityTitle,
                Class: Class,
                Date: ActivityDate,
                Description: ActivityDescription
            }).save()
            res.status(200).json({ message: "Successfully Added!" })
        }
    }


    // getting all activities
    async GetActivities(req, res) {
        try {
            const query = req.query
            // working on query for filter results
            if (query.q || query._start || query._end || query._sort || query._order) {
                let sortingMethod = query._sort;
                const Activities = await activityModel.find(query.q && { Title: query.q }).skip(query._start).limit(query._end - query._start).sort(sortingMethod === "Title" ? { Title: 1 } : sortingMethod === "Class" ? { Class: 1 } : { _id: 1 });
                return res.status(200).json(Activities.map((val) => {
                    return (
                        {
                            id: val._id,
                            Title: val.Title ? val.Title : "",
                            Class: val.Class ? val.Class : "",
                            Date: val.Date ? val.Date : "",
                            Description: val.Description ? val.Description : "",
                        }
                    )
                }))
                // console.log(Activities)
            }
            const Activities = await activityModel.find({})
            // console.log(Activities)
            return res.status(200).json(Activities.map((val) => {
                return (
                    {
                        id: val._id,
                        Title: val.Title ? val.Title : "",
                        Class: val.Class ? val.Class : "",
                        Date: val.Date ? val.Date : "",
                        Description: val.Description ? val.Description : "",
                    }
                )
            }))
            // console.log(Teachers)
        } catch (error) {
            console.log(error);
        }
    }


    // get single activity
    async GetSingleActivity(req, res) {
        let params = req.params.id;
        console.log(params)
        const findSingleActivity = await activityModel.findOne({ _id: params });
        res.status(200).json({
            id: findSingleActivity._id,
            Title: findSingleActivity.Title ? findSingleActivity.Title : "",
            Class: findSingleActivity.Class ? findSingleActivity.Class : "",
            Date: findSingleActivity.Date ? findSingleActivity.Date : "",
            Description: findSingleActivity.Description ? findSingleActivity.Description : "",
        })
    }


    // update single activity
    async UpdateSingleActivity(req, res) {
        const { Id, Class, Title, Date, Description} = req.body
        if (!Title || !Class || !Date || !Description) {
            return res.status(400).json("Incomplete Details!")
        }
        await activityModel.findByIdAndUpdate(
            { _id: Id },
            {
                Class, Title, Date, Description
            },
            { new: true, upsert: true }
        )
        return res.status(200).json("update successfully!")
    }


    // remove activity
    async RemoveSingleActivty(req, res) {
        const { Id } = req.body;
        console.log(Id)
        if (Id) {
            await activityModel.findByIdAndDelete(
                { _id: Id },
            )
            return res.status(200).json("Row Deleted!")
        }
        return res.status(400).json("Error in Deletion")
    }

}
module.exports = new Activity()