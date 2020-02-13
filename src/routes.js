import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import OpenOrderController from './app/controllers/OpenOrderController';
import DeliveriesMadeController from './app/controllers/DeliveriesMadeController';
import StartDeliveryController from './app/controllers/StartDeliveryController';
import EndDeliveryController from './app/controllers/EndDeliveryController';
import AllDeliveryProblemsController from './app/controllers/AllDeliveryProblemsController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries/open', OpenOrderController.index);
routes.get('/deliveryman/:id/deliveries/made', DeliveriesMadeController.index);

routes.put(
  '/deliveryman/:id/deliveries/:orderId/start',
  StartDeliveryController.update
);

routes.put(
  '/deliveryman/:id/deliveries/:orderId/end',
  EndDeliveryController.update
);

routes.get('/deliveries/:id/problem', DeliveryProblemController.index);
routes.post('/deliveries/:id/problem', DeliveryProblemController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliveryman', DeliveryManController.store);
routes.get('/deliveryman', DeliveryManController.index);
routes.put('/deliveryman/:id', DeliveryManController.update);
routes.delete('/deliveryman/:id', DeliveryManController.delete);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.get('/deliveries/problem', AllDeliveryProblemsController.index);
routes.delete('/problem/:id/cancel-delivery', CancelDeliveryController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
