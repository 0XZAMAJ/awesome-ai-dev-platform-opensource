### Security Issue: IDOR on Avatar Deletion Endpoint

#### Root Cause:
The API endpoint `DELETE /api/users/{user_id}/avatar` does not properly enforce authorization checks. As a result, an authenticated user can delete another user's avatar by changing the `user_id` in the URL.

#### Suggested Fix:
Ensure that the backend validates the identity of the user making the request. For example:

- Check that the authenticated user's ID matches the `user_id` in the request.
- If they don’t match, return a `403 Forbidden`.

#### Reference:
Fix for issue: #24
