USE [ARTDECON]
GO
/****** Object:  StoredProcedure [dbo].[AAProArtdecon]    Script Date: 15/4/2021 16:06:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[AAProArtdecon]
    -- Add the parameters for the stored procedure here
    @action NVARCHAR(100),
    @json NVARCHAR(MAX)
AS
BEGIN
    declare @ID_UN nvarchar(30);
    declare @x table (id_unidad nvarchar(30))
    insert into @x
    select *
    from
        openjson(@json)
        WITH
        (
            [id_unidad] nvarchar(30)
        );
    set @ID_UN =
    (
        select id_unidad
    from @x
    );

    -- ##############################################################################
    --									
    --						TODO:	Example
    -- 	
    -- ##############################################################################

    IF @action = 'example'
    BEGIN
        BEGIN try
            SELECT *
        FROM
            Openjson(@json)
                WITH
                (
                    id_un nvarchar(50) '$.code_empresa',
                    firstname nvarchar(50) '$.name'
                );
        END try
        BEGIN catch
            SELECT 'ERROR DE OPERACION: ' + Error_message();
        END catch
    END




    -- ##############################################################################
    --									
    --						TODO:-01	Listar Empresas
    -- 	
    -- ##############################################################################
    IF @action = 'get_empresa'
    begin
        SELECT
            (
                SELECT id_un,
                nombre
            FROM unidades_negocios AS un
            WHERE un.id_un_superior = 'raiz'
            FOR json path
            ) data
    END


    -- ##############################################################################
    --									
    --						TODO:-02	Login
    -- 	
    -- ##############################################################################



    IF @action = 'login'
    BEGIN
        BEGIN TRY
            DECLARE @usuario TABLE
            (
            code_empresa varchar(50),
            cedula varchar(50)
            )
            insert into @usuario
        SELECT *
        FROM
            OPENJSON(@json)
                WITH
                (
                    [code_empresa] NVARCHAR(max),
                    [cedula] NVARCHAR(max)
                );
            select
            (
                    select ID_UN,
                USUARIO,
                CLAVE_SECUNDARIA,
                NOMBRE,
                ID_ROL
            from USUARIOS as _user,
                @usuario as xuser
            where _user.USUARIO = xuser.cedula
                AND _user.ID_UN = xuser.code_empresa
            for json path, WITHOUT_ARRAY_WRAPPER
                ) as data
        END TRY
        BEGIN CATCH
            SELECT CAST(ERROR_NUMBER() AS NVARCHAR(50)) + ' ' + CAST(ERROR_LINE() AS NVARCHAR(50)) + ' '
                   + ERROR_MESSAGE() AS ErrorMessage
        END CATCH
    END



    -- ##############################################################################
    --									
    --						TODO:-03	Actualizar la contraseña
    -- 	
    -- ##############################################################################



    IF @action = 'upadte-user'
    BEGIN
        BEGIN TRY
            DECLARE @user1 TABLE
            (
            pass NVARCHAR(max),
            cedula varchar(50)
            )
            insert into @user1
        select *
        from
            openjson(@json)
                WITH
                (
                    [pass] NVARCHAR(max),
                    [cedula] varchar(50)
                );
            UPDATE USUARIOS
            SET CLAVE_SECUNDARIA = n.pass
            from @user1 as n
            WHERE USUARIO = n.cedula;
            select
            (
                    select *
            from USUARIOS,
                @user1 as n
            where USUARIO = n.cedula
            for json path, WITHOUT_ARRAY_WRAPPER
                ) as data;
        END TRY
        BEGIN CATCH
            SELECT 'ERROR DE OPERACION: ' + ERROR_MESSAGE();
        END CATCH
    END


    -- ##############################################################################
    --									
    --						TODO:-04	Listar Dominio 
    -- 	
    -- ##############################################################################


    IF @action = 'get_dominios'
    BEGIN

        select ((
                (
                    select ep.ID_UN,
                ep.CLASE,
                ep.CODIGO,
                (
                           (
                               select itD.*
                from ITM_DOMINIOS itD
                where ID_GRUPO_DOMINIO = 'BASES COSTO'
                for json path
                           )
                           ) todos
            from ESPECIFICACIONES_PRODUCCION ep,
                @x as x
            where ep.ID_UN = x.id_unidad
                and ep.CLASE = 'BASES COSTO'
            for json auto, WITHOUT_ARRAY_WRAPPER
                )
                )
               ) as data;
    END


    -- ##############################################################################
    --									
    --						TODO:-05	Actualizar Dominio
    -- 	
    -- ##############################################################################


    IF @action = 'update_dominios'
    BEGIN
        DECLARE @BCOSTO TABLE
        (
            id_unidad NVARCHAR(30),
            udclase varchar(60),
            code nvarchar(60),
            ud_descticcion nvarchar(60),
            fecha nvarchar(60)
        )
        --___________________________________________________________________
        --___________________________________________________________________
        insert into @BCOSTO
        select *
        from
            openjson(@json)
            WITH
            (
                [id_unidad] NVARCHAR(30),
                [udclase] NVARCHAR(60),
                [code] NVARCHAR(60),
                [ud_descticcion] NVARCHAR(60),
                [fecha] nvarchar(60)
            );
        --_______________,____________________________________________________
        --___________________________________________________________________
        UPDATE ESPECIFICACIONES_PRODUCCION
        SET CODIGO = bc.code,
            DESCRIPCION = bc.ud_descticcion,
            FECHA_DESDE = bc.fecha,
            FECHA_HASTA = bc.fecha
        FROM @BCOSTO as bc,
            ESPECIFICACIONES_PRODUCCION as ep
        WHERE ep.ID_UN = bc.id_unidad
            and ep.CLASE = bc.udclase;
        --___________________________________________________________________
        --___________________________________________________________________
        select
            (
                select a.*
            from ESPECIFICACIONES_PRODUCCION as a,
                @BCOSTO as c
            where a.ID_UN = c.id_unidad
                and a.CLASE = c.udclase
            for json path
            ) as data
    END



    -- #####################################################################################################################
    --   
    --						TODO:-06	Listart Mano de Obra
    -- 
    -- Select para crear diferentes  unidades precios de la unidad de medida  mano de obra definida		
    -- #####################################################################################################################


    IF @action = 'Mano_de_obra'
    BEGIN
        select
            (
                select a.*
            from ESPECIFICACIONES_PRODUCCION as a,
                @x as x
            where CLASE = 'MANO DE OBRA'
                and a.ID_UN = x.id_unidad
            for json path
            ) as data


    END
    -- ##############################################################################
    --									
    --						TODO:-07	Listart unidad de medidas
    -- 	
    -- ##############################################################################



    IF @action = 'unidad_medida'
            BEGIN
        select
            (
                        SELECT *
            FROM UNIDADES_MEDIDA
            WHERE TIPO = 'TIEMPO'
            for json path
                    ) as data
    --select * from UNIDADES_MEDIDA

    END

    -- #####################################################################################################################
    --   
    --						TODO:-08  Listar CIF
    -- 		
    -- Select para crear diferentes  unidades precios de la unidad de medida  mano de obra definida
    -- #####################################################################################################################


    IF @action = 'getCif'
    BEGIN
        select
            (
                select a.*
            from ESPECIFICACIONES_PRODUCCION as a,
                @x as x
            where CLASE = 'CIF'
                and a.ID_UN = x.id_unidad
            for json path
            ) as data


    END


    -- #################################################################################################################
    --   
    --					TODO:-09  Listar Secciones 
    -- 		
    -- Select para crear diferentes  unidades precios de la unidad de medida mano de obra definida
    -- #################################################################################################################


    IF @action = 'getSecciones'
    BEGIN
        -- Asigna numero de item a la unidad de negocios raiz
        declare @productos nvarchar(max);
        DECLARE @SQLS NVARCHAR(500)
        DECLARE @TRAIZ TABLE
        (
            ANTERIOR INT,
            ID_UN_ITEM NVARCHAR(50)
        )
        INSERT INTO @TRAIZ
        SELECT ANTERIOR,
            ID_UN_ITEM
        FROM SECCIONES AS A
        WHERE ID_UN_ITEM IS NOT NULL
            AND ID_UN_ITEM <> ''
        GROUP BY ANTERIOR,
                 ID_UN_ITEM

        -- Crea estructura con las UNs tipo Planta
        SELECT CAST(@ID_UN AS NVARCHAR(150)) AS ID_UN,
            ID_UN AS ID_SECCION,
            10000 + ROW_NUMBER() OVER (ORDER BY ID_UN ASC) AS ITEM,
            CAST(NOMBRE AS NVARCHAR(1250)) AS DESCRIPCION,
            0 AS ANTERIOR,
            CAST('' AS NVARCHAR(50)) AS ID_UN_ITEM,
            0 AS ASIGNABLE,
            CONVERT(NVARCHAR(50), 'ACTIVO') AS ESTADO,
            0 AS INVENTARIO,
            CAST('Planta' AS NVARCHAR(30)) AS TIPO,
            0 AS MANO_OBRA,
            CAST('' AS NVARCHAR(1000)) AS MSG
        INTO #TSECC
        FROM UNIDADES_NEGOCIOS
        WHERE TIPO = 'Planta'

        -- Si no hay UNs definidas
        IF NOT EXISTS (SELECT ANTERIOR
        FROM #TSECC
        WHERE TIPO = 'Planta')
            INSERT INTO #TSECC
        VALUES
            (@ID_UN, 'NO EXISTE', 0, 'No hay definidas UN tipo Planta', 0, '', 0, 'ACTIVO', 0, '')

        -- Actualiza los items de las UNs con el respectivo Item de las secciones raiz
        UPDATE T
        SET T.ITEM = R.ANTERIOR
        FROM #TSECC AS T
            INNER JOIN @TRAIZ AS R
            ON T.ID_SECCION = R.ID_UN_ITEM

        -- Incluye el resto de secciones
        IF @productos <> ''
            SET @SQLS = 'SELECT *,'''' FROM SECCIONES WHERE ' + @productos
        ELSE
            SET @SQLS = 'SELECT *,'''' FROM SECCIONES'
        INSERT INTO #TSECC
        EXEC (@SQLS)
        select
            (
                SELECT *
            FROM #TSECC
            for json path
            ) data
        DROP TABLE #TSECC

    END














    -- ##############################################################################
    --									
    --						TODO:-10	Editar Seccion 
    -- 		para hacer pruebas 
    --	exec AAProArtdecon 'EditSeccion', '{"DESCRIPCION":"I+D","ANTERIOR":0,"ASIGNABLE":true,"ESTADO":"ACTIVO","ID_SECCION":"ID01","INVENTARIO":true,"ITEM":10001,"MANO_OBRA":true,"ID_UN":"00"}'
    -- ##############################################################################


    IF @action = 'EditSeccion'
    BEGIN
        BEGIN TRY
            DECLARE @Seccion01 TABLE
            (
            [DESCRIPCION] [nvarchar](250) NULL,
            [ID_UN] [nvarchar](50) NOT NULL,
            [ANTERIOR] [int] NULL,
            [ASIGNABLE] [bit] NULL,
            [ESTADO] [nvarchar](20) NULL,
            [ID_SECCION] [nvarchar](150) NOT NULL,
            [ITEM] [int] NOT NULL,
            [INVENTARIO] [bit] NULL,
            [MANO_OBRA] [bit] NULL
            )


            insert into @Seccion01
        select *
        from
            openjson(@json)
                WITH
                (
                    [DESCRIPCION] NVARCHAR(max),
                    [ID_UN] NVARCHAR(max),
                    [ANTERIOR] int,
                    [ASIGNABLE] bit,
                    [ESTADO] NVARCHAR(max),
                    [ID_SECCION] NVARCHAR(max),
                    [ITEM] INT,
                    [INVENTARIO] bit,
                    [MANO_OBRA] bit
                );

            UPDATE s
            SET s.DESCRIPCION = n.DESCRIPCION,
                s.ID_UN = n.ID_UN,
                s.ANTERIOR = n.ANTERIOR,
                s.ASIGNABLE = n.ASIGNABLE,
                s.ESTADO = n.ESTADO,
                s.ITEM = n.ITEM,
                s.INVENTARIO = n.INVENTARIO,
                s.MANO_OBRA = n.MANO_OBRA
            FROM SECCIONES as s,
            @Seccion01 AS n
            where s.ID_SECCION = N.ID_SECCION

            SELECT
            (
                    select a.*
            from SECCIONES as a,
                @Seccion01 as b
            WHERE a.ID_SECCION = b.ID_SECCION
            for json path
                ) as data;

        END TRY
        BEGIN CATCH
            SELECT 'ERROR DE OPERACION: ' + ERROR_MESSAGE();
        END CATCH


    END


    -- ##############################################################################
    --									
    --						TODO:-11	Eliminar Seccion 
    -- 	ACTIVE:
    -- ##############################################################################




    IF @action = 'EliminarSeccion'
            BEGIN
        BEGIN TRY
                    select *
        from SECCIONES


                END TRY
                BEGIN CATCH
                    SELECT 'ERROR DE OPERACION: ' + ERROR_MESSAGE();
                END CATCH
    END








    -- ##############################################################################
    --						
    --						 TODO:-12	Nueva Seccion  
    --
    -- mano de obra definida		
    -- ##############################################################################




    IF @action = 'NuevaSeccion'
        BEGIN
        BEGIN TRY
                        DECLARE @Seccion04 TABLE
                        (
            [DESCRIPCION] [nvarchar](250) NULL,
            [ID_UN] [nvarchar](50) NOT NULL,
            [ANTERIOR] [int] NULL,
            [ASIGNABLE] [bit] NULL,
            [ESTADO] [nvarchar](20) NULL,
            [ID_SECCION] [nvarchar](150) NOT NULL,
            [ITEM] [int] NOT NULL,
            [INVENTARIO] [bit] NULL,
            [MANO_OBRA] [bit] NULL
                        )

        END TRY
        BEGIN CATCH
            SELECT 'ERROR DE OPERACION: ' + ERROR_MESSAGE();
        END CATCH
    END

    -- #################################################################################################################
    -- 
    --							a-TODO:-13 Listar Empleados
    -- 
    --  Select para crear diferentes  unidades  precios de la unidad de medida  mano de obra definida		
    -- #################################################################################################################



    IF @action = 'getEmpleados'
        BEGIN

        declare @seccion nvarchar(90);
        set @seccion = ((
                            select seccion
        from openjson(@json) WITH ([seccion] nvarchar(30))
                        ));
        select
            (
                    SELECT S.ID_UN,
                S.ID_SECCION,
                S.ID_EMPLEADO,
                S.TIPO,
                E.NOMBRE_COMPLETO AS NOMBRE,
                S.ITEM
            FROM RS_EMPLEADOS_ID AS E,
                ITM_EMPLEADOS_SECCIONES AS S
            WHERE E.ID_UN = S.ID_UN
                AND E.ID_EMPLEADO = S.ID_EMPLEADO
                AND S.ID_SECCION = @seccion
            for json path
                ) as data
    END


    -- ##############################################################################
    --									
    --						TODO:-14	Listar Todos los Empleados
    -- 	
    -- ##############################################################################


    IF @action = 'getAllEmpleados'
    BEGIN
        select
            (
                SELECT S.ID_UN,
                S.ID_SECCION,
                S.ID_EMPLEADO,
                S.TIPO,
                E.NOMBRE_COMPLETO AS NOMBRE,
                S.ITEM
            FROM RS_EMPLEADOS_ID AS E,
                ITM_EMPLEADOS_SECCIONES AS S
            WHERE E.ID_UN = S.ID_UN
                AND E.ID_EMPLEADO = S.ID_EMPLEADO
            for json path
            ) as data
    END
    -- ##############################################################################
    --									
    --						TODO:-15	Listar Productos
    -- 	
    -- ##############################################################################

    IF @action = 'ListProductos'
        BEGIN
                select (
        (
        select *
                    from PRODUCTOS
                    for json path
        )
        ) as data

    END

END
