/**
 * devAuth Middleware
 * Protects CMS routes with Basic Authentication
 */
import 'dotenv/config';

export const devAuth = (req, res, next) => {
    // Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Developer CMS"');
        return res.status(401).json({ error: 'Authentication required' });
    }

    // Parse credentials
    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
    // Check against env variables
    // Hardcoded for stability - TODO: Move back to env variables
    const VALID_USER = 'dulumoni';
    const VALID_PASS = 'dulumoni';

    if (user === VALID_USER && pass === VALID_PASS) {
        next(); // Authorized
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Developer CMS"');
        res.status(403).json({ error: 'Invalid credentials' });
    }
};
