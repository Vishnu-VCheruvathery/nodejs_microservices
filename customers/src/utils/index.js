const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqplib = require('amqplib')
const { APP_SECRET, QUEUE_NAME, MESSAGE_BROKER_URL, EXCHANGE_NAME, CUSTOMER_BINDING_KEY } = require("../config");

// Utility functions
module.exports.GeneratePassword = async (password) => {
  return await bcrypt.hash(password, 10); // 10 salt rounds
};

module.exports.ValidatePassword = async (enteredPassword, savedPassword) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

/*  Message Broker */

//create a channel
module.exports.CreateChannel = async() => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL)
  const channel = await connection.createChannel()
  await channel.assertExchange(EXCHANGE_NAME, 'direct', false)
  return channel
  } catch (error) {
    throw error
  }
}
//publish messages
module.exports.PublishMessage = async(channel, binding_key, message) => {
     try {
          await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message))
     } catch (error) {
      throw error;
     }
}

//subscribe messages
module.exports.SubscribeMessage = async(channel, service, binding_key) => {
        try {
          const appQueue = await channel.assertQueue(QUEUE_NAME);

          channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY);
          channel.consume(appQueue.queue, data => {
            console.log('received data');
            console.log(data.content.toString());
            service.SubscribeEvents(data.content.toString())
            channel.ack(data);
          })
        } catch (error) {
          throw error;
        }     
}