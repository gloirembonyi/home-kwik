
  // Example Swagger API Documentation
  /**
   * @swagger
   * /api/v1/dashboard/stats:
   *   get:
   *     summary: Get dashboard statistics
   *     responses:
   *       200:
   *         description: Dashboard statistics
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DashboardStats'
   * 
   * /api/v1/rides/active:
   *   get:
   *     summary: Get all active rides
   *     responses:
   *       200:
   *         description: List of active rides
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Ride'
   * 
   * /api/v1/drivers:
   *   get:
   *     summary: Get all drivers
   *     responses:
   *       200:
   *         description: List of drivers
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Driver'
   * 
   * components:
   *   schemas:
   *     DashboardStats:
   *       type: object
   *       properties:
   *         totalRides:
   *           type: number
   *         activeDrivers:
   *           type: number
   *         completionRate:
   *           type: number
   *         avgFare:
   *           type: number
   *         revenueToday:
   *           type: number
   *     
   *     Ride:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *         userId:
   *           type: string
   *         driverId:
   *           type: string
   *         pickup:
   *           type: object
   *           properties:
   *             lat:
   *               type: number
   *             lng:
   *               type: number
   *             address:
   *               type: string
   *         destination:
   *           type: object
   *           properties:
   *             lat:
   *               type: number
   *             lng:
   *               type: number
   *             address:
   *               type: string
   *         status:
   *           type: string
   *           enum: [requested, accepted, in_progress, completed, cancelled]
   *         fare:
   *           type: number
   *         timestamp:
   *           type: string
   *     
   *     Driver:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *         name:
   *           type: string
   *         rating:
   *           type: number
   *         totalRides:
   *           type: number
   *         status:
   *           type: string
   *           enum: [available, busy, offline]
   *         currentLocation:
   *           type: object
   *           properties:
   *             lat:
   *               type: number
   *             lng:
   *               type: number
   */