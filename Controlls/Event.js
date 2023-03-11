const eventModel = require("../models/Events")
const fs = require("fs")
const path = require('path');
const Jimp = require("jimp");


// image compression and setup
const ImageCompression = async (imageSelct, user) => {
    // image setup compression
    const buffer = Buffer.from(imageSelct.replace(/^data:image\/(jpg|jpeg|png);base64,/, ''), 'base64')
    const imageName = `image_${Date.now()}_${Math.round(
        Math.random() * 1e9 //ye million hai
    )}.png`

    const jimpResp = await Jimp.read(buffer);
    if (user === "Event") {
        jimpResp.resize(550, Jimp.AUTO).write(path.resolve(__dirname, `../Storage/Events/${imageName}`))
        return imageName;
    }

}
class Events {
    // Add event
    async AddEvent(req, res) {
        try {
            const { EventTitle, EventDescription, StartingDateTime, EndingDateTime, EventImage } = req.body;
            if (!EventTitle || !EventDescription || !StartingDateTime || !EndingDateTime) {
                return res.status(400).json("Incomplete Details!")
            }
            let ImageRes
            if (EventImage) {
                // image compression and saving to specific folder
                ImageRes = await ImageCompression(EventImage, "Event")
            }
            await eventModel({
                Title: EventTitle,
                StartDate: StartingDateTime,
                EndDate: EndingDateTime,
                Description: EventDescription,
                EventPicture: ImageRes ? ImageRes : ""
            }).save();
            return res.status(200).json({ message: "successfully created!" })
        } catch (error) {
            console.log(error);
        }
    }


    // get all classes
    async GetEvents(req, res) {
        try {
            const query = req.query
            // working on query for filter results
            if (query.q || query._start || query._end || query._sort || query._order) {
                let sortingMethod = query._sort;
                const EventsQuery = await eventModel.find(query.q && { Title: query.q }).skip(query._start).limit(query._end - query._start).sort(sortingMethod === "Title" ? { Title: 1 } : sortingMethod === "StartDate" ? { StartDate: 1 } : { _id: 1 });
                return res.status(200).json(EventsQuery.map((val) => {
                    return (
                        {
                            id: val._id,
                            Title: val.Title ? val.Title : "",
                            StartDate: val.StartDate ? val.StartDate : "",
                            EndDate: val.EndDate ? val.EndDate : "",
                            Description: val.Description ? val.Description : "",
                            EventPicture: val.EventPicture ? val.EventPicture : ""
                        }
                    )
                }))
            }
            const Events = await eventModel.find({});// getting all events
            return res.status(200).json(Events.map((val) => {
                return (
                    {
                        id: val._id,
                        Title: val.Title ? val.Title : "",
                        StartDate: val.StartDate ? val.StartDate : "",
                        EndDate: val.EndDate ? val.EndDate : "",
                        Description: val.Description ? val.Description : "",
                        EventPicture: val.EventPicture ? val.EventPicture : ""
                    }
                )
            }))
        } catch (error) {
            console.log(error);
        }
    }


    // get single event info
    async GetSingleEvent(req, res) {
        let params = req.params.id;
        console.log(params)
        const findSingleEvent = await eventModel.findOne({ _id: params });
        res.status(200).json({
            id: findSingleEvent._id,
            Title: findSingleEvent.Title ? findSingleEvent.Title : "",
            StartDate: findSingleEvent.StartDate ? findSingleEvent.StartDate : "",
            EndDate: findSingleEvent.EndDate ? findSingleEvent.EndDate : "",
            Description: findSingleEvent.Description ? findSingleEvent.Description : "",
            EventPicture: findSingleEvent.EventPicture ? findSingleEvent.EventPicture : ""
        })
    }


    //update single event
    async UpdateSingleEvent(req, res) {
        const { Id,EventTitle, EventDescription, StartingDateTime, EndingDateTime,EventPicture, imageSelct } = req.body;
        //    console.log(Id,EventTitle, EventDescription, StartingDateTime, EndingDateTime,EventPicture, imageSelct)
        const findEventAndUpdate = await eventModel.findByIdAndUpdate(
            { _id: Id },
            {
                Title: EventTitle,
                StartDate: StartingDateTime,
                EndDate: EndingDateTime,
                Description: EventDescription,
            },
            { new: true, upsert: true }
        )
        if (EventPicture !== null) {
            if (imageSelct !== null) {
                fs.unlinkSync(path.join(__dirname, `../Storage/Events/${EventPicture}`)) //deleting existing image
                const ImageRes = await ImageCompression(imageSelct, "Event") // image compression and creating new image and saving to user record
                await eventModel.findByIdAndUpdate(
                    { _id: findEventAndUpdate._id },
                    { EventPicture: ImageRes },
                    { new: true, upsert: true }
                )
                return res.status(200).json("image updated successfully!")
            } else {
                return res.status(200).json("updated successfully! 1")
            }
        } else {
            if (imageSelct !== null) {
                const ImageRes = await ImageCompression(imageSelct, "Event") // image compression and creating new image and saving to user record
                await eventModel.findByIdAndUpdate(
                    { _id: findEventAndUpdate._id },
                    { EventPicture: ImageRes },
                    { new: true, upsert: true }
                )
                return res.status(200).json("image updated successfully!")
            } else {
                return res.status(200).json("updated successfully! 2")
            }
        }

    }




    // remove event
    async RemoveSingelEvent(req, res) {
        const { Id } = req.body;
        // remove from parent table
        if (Id) {
            // remove from student table
            const event=await eventModel.findByIdAndDelete(
                { _id: Id }
            )
            fs.unlinkSync(path.join(__dirname, `../Storage/Events/${event.EventPicture}`))
        }
        res.status(200).json("Row Deleted!")
    }


}
module.exports = new Events()
