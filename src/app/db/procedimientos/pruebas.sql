
exec AAProArtdecon 'get_empresa', '{"ID_UN":"00"}'
exec AAProArtdecon 'get_empresa', '{"id_unidad":"00"}'

exec AAProArtdecon 'getEmpleados', '{"id_unidad":"00"}'

exec AAProArtdecon 'getSecciones', '{"id_unidad":"00"}'

declare @user NVARCHAR(max);
set @user = '{
    "name": "Oscar Herrera Lugo",
    "id": "1127579854"
}'


update USUARIOS
    set NOMBRE = JSON_VALUE(@user, '$.name')
where USUARIO = JSON_VALUE(@user, '$.id')

SELECT *
FROM USUARIOS
where USUARIO = JSON_VALUE(@user, '$.id')



-- select * from USUARIOS where USUARIO = JSON_VALUE(@user, '$.USUARIO')



-- select (
--     select *
--     from SECCIONES
--     where ID_SECCION = 'ID0101'
--     for json path
-- ) as data 
