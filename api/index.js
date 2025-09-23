/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
const serverless = require("serverless-http")
const app = require("../server")

module.exports = serverless(app)
