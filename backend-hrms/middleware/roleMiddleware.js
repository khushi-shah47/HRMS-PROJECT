export const authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        const userRole = req.user?.role?.toLowerCase();
        const allowedRoles = roles.map(r => r.toLowerCase());
        
        console.log(`[Role Check] Requested Roles: ${allowedRoles}, User Role: ${userRole}`);
        
        if(!userRole || !allowedRoles.includes(userRole)){
            console.warn(`[Role Access Denied] User ID: ${req.user?.id}, Role: ${req.user?.role} tried to access ${req.originalUrl}`);
            return res.status(403).json({
                message:"Access denied"
            });
        }
        next();
    };
};