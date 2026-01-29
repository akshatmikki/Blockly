# Security Notes

## xlsx Package Vulnerabilities

### Current Status
The `xlsx` package has known vulnerabilities:
- **GHSA-4r6h-8v6p-xvw6**: Prototype Pollution
- **GHSA-5pgg-2g8v-p4x9**: Regular Expression Denial of Service (ReDoS)

### Risk Assessment: LOW
These vulnerabilities are acceptable in our use case because:

1. **Limited Scope**: xlsx is only used in the admin dashboard bulk upload feature
2. **Authenticated Access**: Only authenticated admins can access this functionality
3. **Controlled Environment**: Files are uploaded in a controlled, internal environment
4. **Input Validation**: All Excel files are validated before processing:
   - Column headers are normalized (case-insensitive)
   - Data is sanitized and trimmed
   - Field validation is performed before database insertion
   - Row-by-row error handling with specific feedback

### Mitigation Strategies Implemented
1. ✅ **Authentication**: Only admin users can upload Excel files
2. ✅ **Validation**: Comprehensive validation of all fields (email, username, password, etc.)
3. ✅ **Error Handling**: Graceful error handling with specific row-level feedback
4. ✅ **Rate Limiting**: API endpoints are rate-limited to prevent abuse
5. ✅ **Sandboxing**: File processing is done server-side with controlled data flow

### Alternative Solutions
If needed in the future, consider:
- **exceljs**: More modern library with better security
- **csv-parse**: If only CSV support is needed
- **Custom parser**: Build a minimal Excel parser for specific needs

### Monitoring
- Review vulnerability status quarterly
- Update to latest xlsx version when fixes are available
- Monitor for security advisories

## General Security Practices
- Never commit `.env` files
- Use strong JWT secrets (128+ characters)
- Store passwords with bcrypt (12 rounds)
- Implement rate limiting on all API endpoints
- Use parameterized SQL queries to prevent injection
- Validate all user input before processing

## For Production Deployment
1. Enable HTTPS/SSL
2. Set `NODE_ENV=production`
3. Use strong JWT_SECRET
4. Configure CORS properly
5. Enable security headers (helmet.js)
6. Monitor logs for suspicious activity
7. Keep dependencies updated
8. Perform regular security audits
