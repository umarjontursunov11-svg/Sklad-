-- Admin foydalanuvchisi Supabase Auth'da yaratilgandan KEYIN ishga tushiring
-- («Склад» loyihasi -> SQL Editor). Ilovadagi "admin" loginini shu hisobga bog'laydi.
UPDATE public.users
SET username = 'admin',
    full_name = 'Tursunov Umarjon',
    name = 'Tursunov Umarjon (Admin)',
    employee_id = 'EMP-0001',
    role_id = '11111111-1111-1111-1111-111111111111',
    must_change_password = false
WHERE lower(email) = 'admin@warehouse.io';

-- Tekshiruv: 1 qator, role = admin chiqishi kerak
SELECT u.email, u.username, r.name AS role
FROM public.users u JOIN public.roles r ON r.id = u.role_id;
