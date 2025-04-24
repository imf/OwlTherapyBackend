import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
// import swaggerUi from 'swagger-ui-express';
import { swaggerUi, swaggerDocs } from './config/swagger';
import { OpenAPIV3 } from 'openapi-types';
import './config/db';
import cors from 'cors';
import { corsOptions } from './config/cors';
import healthRoutes from './routes/healthRoutes';
import { useChainLink } from './middleware/useChainLink';
// import useChainLinkTransactionRoutes from './routes/chainLinkTransactionRoutes';
import { requestLogger } from './middleware/loggingMiddleware';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import passwordRoutes from './routes/passwordRoutes';
import roleRoutes from './routes/roleRoutes';
import sessionRoutes from './routes/sessionRoutes';
import tokenRoutes from './routes/tokenRoutes';
import therapistRoutes from './routes/therapistRoutes';
import patientRoutes from './routes/patientRoutes';
import calendarSessionRoutes from './routes/calendarSessionRoutes'
import recurrencePatternRoutes from './routes/recurrencePatternRoutes'
import therapeuticRelationshipRoutes from './routes/therapeuticRelationshipRoutes'
import therapeuticRelationshipParticipantRoutes from './routes/therapeuticRelationshipParticipantRoutes'
import billingRateRoutes from './routes/billingRateRoutes'



const app = express();
const hostname = process.env.HOST || "localhost"
const port = process.env.PORT || "3000";

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(useChainLink)
// app.use(useChainLinkTransactionRoutes)
app.use(requestLogger);

app.use(healthRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/password', passwordRoutes);
app.use('/roles', roleRoutes);
app.use('/sessions', sessionRoutes);
app.use('/tokens', tokenRoutes);
app.use('/therapists', therapistRoutes);
app.use('/patients', patientRoutes);
app.use('/calendar-sessions', calendarSessionRoutes)
app.use('/recurrence-patterns', recurrencePatternRoutes)
app.use('/therapeutic-relationships', therapeuticRelationshipRoutes)
app.use('/therapeutic-relationship-participants', therapeuticRelationshipParticipantRoutes)
app.use('/billing-rates', billingRateRoutes)


// redirect / to /api-docs
app.get('/', (req: Request, res: Response) => {
  res.redirect('/api-docs');
});

const typedSwaggerDocs = swaggerDocs as OpenAPIV3.Document
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customSiteTitle: typedSwaggerDocs.info.title}))

// Start the server
app.listen(port, () => {
  console.log(`Aurora Bacckend running at http://${hostname}:${port}`);
});

export default app;
