import { Router } from 'express';
import { Controller } from './category.controller';
import { Crawler } from './category.crawler';

import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: "https://doanlthtvdk.firebaseio.com"
});

const crawler = new Crawler();
const controller = new Controller(crawler);
const router = Router();

router.get('/', controller.getAllCategories);

export default router;