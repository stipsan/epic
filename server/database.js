var Redis = require('ioredis');
var redis = new Redis(process.env.REDIS_URL);

const INVITE_EXPIRE = 

function getUserByID(id) {
  
};

function getUserByUsername(username) {
  
};

function createUser(username, success, error) {
  redis.incr('next_user_id').then(result => {
    const id = Math.max(Number(result), 1);
    
    // validate if username exists
    redis.hsetnx('users', username, id).then(result => {
      if(result === 0) return; //@TODO handle error
      
      // validate if id exists
      redis.hsetnx(`user:${id}`, 'username', username).then(result => {
        if(result === 0) return; //@TODO handle error
        
        
      });
    });
  });
};

function userInviteFriend(data, success, failure) {
  console.log('userInviteFriend', data);
  redis.hget('users', data.user.username).then(id => {
    if(id < 1) return failure({message: `User '${data.user.username}' does not exist!`});
    
    redis.sadd(`requests:${id}`, data.friend.username);
    redis.hget('users', data.friend.username).then(id => {
      if(id < 1) return failure({message: `Friend '${data.friend.username}' does not exist!`});
      
      
      redis.sadd(`invites:${id}`, data.user.username);
      success(id);
    });
  });
}

//createUser(require('faker').name.firstName(), () => {}, () => {});
/*
for (var i = 0; i < 20; i++) {
   createUser(require('faker').name.firstName(), () => {}, () => {});
}
*/

function loginUser(data, success, failure) {
  redis.hget('users', data.username).then(id => {
    if(id < 1) return failure({message: `User '${data.username}' does not exist!`});
    
    redis.multi([
      ['hgetall', 'users'],
      ['smembers', `user:${id}:invites`],
      ['smembers', `user:${id}:requests`],
      ['hset', `user:${id}`, 'online', 1],
      // @TODO temp measures to ease testing of invite system
      ['expire', `user:${id}:invites`, 120],
      ['expire', `user:${id}:requests`, 120],
    ]).exec((err, results) => {
      // @TODO investigate if error handling is correct here
      
      if(err) return
      const users    = results[0][1];
      delete           users[data.username];
      const friends  = Object.keys(users).reduce(
        (previousValue, currentValue, currentIndex) => [
          ...previousValue,
          { id: users[currentValue], username: currentValue }
        ], []);        
      const invites  = results[1][1];
      const requests = results[2][1];
      console.log('redis.multi', results);
      
      success({
        username: data.username,
        id,
        friends,
        invites,
        requests,
      });
    });
    console.log('loginUser', data.username, id);
  });
};

function logoutUser(data, success, failure) {
  
    redis.multi([
      ['hgetall', 'users'],
      ['smembers', `invites:${id}`],
      ['smembers', `requests:${id}`],
      ['hset', `user:${id}`, 'online', 1],
      // @TODO temp measures to ease testing of invite system
      ['expire', `invites:${id}`, 120],
      ['expire', `requests:${id}`, 120],
    ]).exec((err, results) => {
      const users    = results[0][1];
      delete           users[data.username];
      const friends  = Object.keys(users).reduce(
        (previousValue, currentValue, currentIndex) => [
          ...previousValue,
          { id: users[currentValue], username: currentValue }
        ], []);        
      const invites  = results[1][1];
      const requests = results[2][1];
      
      success(data);
    });
    console.log('logoutUser', data.username, id);
};

module.exports = {
  getUserByID,
  getUserByUsername,
  loginUser,
  logoutUser,
  userInviteFriend,
  createUser,
};