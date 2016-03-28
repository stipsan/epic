import { createDispatcher } from './dispatcher'
import * as database from '../../database'
import { RECEIVE_FRIEND_NETWORK_STATUS } from '../../constants/ActionTypes'

export const createSocketServer = (scServer, redis) => {
  
  scServer.on('connection', function(socket){
    // @TODO handle .off to cleanup disconnected clients
    const dispatchEventHandler = createDispatcher(socket, database, redis)
    
    
    //console.log(process.pid, 'a user connected', authToken);
    
    socket.on('disconnect', () => {
      if(socket.authToken) {
        const id = socket.authToken.id
        const lastVisit = new Date().toJSON()
        dispatchEventHandler({
          type: RECEIVE_FRIEND_NETWORK_STATUS,
          online: '0',
          lastVisit,
          id,
        })
        /*scServer.exchange.publish('service', {
          type: TYPES.RECEIVE_FRIEND_NETWORK_STATUS,
          id: socket.authToken.id,
          username: socket.authToken.username
        })*/
      }
    })
    
  })
}