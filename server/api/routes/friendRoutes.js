const express = require('express')
const router = express.Router()
const controllers = require('../controllers/friendControllers')

router.get("/:userId/get-requests-friend",controllers.get_requests_friend)
router.get("/:userId/get-sent-requests", controllers.get_sent_requests)
router.get("/:userId/get-received-requests", controllers.get_received_requests)
router.get("/:userId/get", controllers.get_friend_info)
router.get("/:userId/get-posts", controllers.get_friend_posts)
router.get("/:userId/get-my-friends",controllers.get_my_friends)

router.post("/find",controllers.find_request)
router.post("/:userId/sent-request-friend",controllers.create_request_friend)
router.post("/add-friend",controllers.accept_request_friend)
router.post("/pull-friend",controllers.pull_friend_from_list)

router.delete("/:requestId/delete-friend", controllers.delete_request_friend)


module.exports = router