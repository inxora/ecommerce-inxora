--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5

-- Started on 2025-09-30 11:54:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER pgrst_drop_watch;
DROP EVENT TRIGGER pgrst_ddl_watch;
DROP EVENT TRIGGER issue_pg_net_access;
DROP EVENT TRIGGER issue_pg_graphql_access;
DROP EVENT TRIGGER issue_pg_cron_access;
DROP EVENT TRIGGER issue_graphql_placeholder;
DROP PUBLICATION supabase_realtime_messages_publication;
DROP PUBLICATION supabase_realtime;
DROP POLICY "Upload imágenes productos - usuarios autenticados" ON storage.objects;
DROP POLICY "Public read access for user avatars" ON storage.objects;
DROP POLICY "Public read access for product images" ON storage.objects;
DROP POLICY "Public read access for category images" ON storage.objects;
DROP POLICY "Public read access for brand images" ON storage.objects;
DROP POLICY "Lectura pública de imágenes de productos" ON storage.objects;
DROP POLICY "Eliminar imágenes productos - autenticado" ON storage.objects;
DROP POLICY "Authenticated upload for user avatars" ON storage.objects;
DROP POLICY "Authenticated upload for product images" ON storage.objects;
DROP POLICY "Authenticated upload for category images" ON storage.objects;
DROP POLICY "Authenticated upload for brand images" ON storage.objects;
DROP POLICY "Authenticated update for user avatars" ON storage.objects;
DROP POLICY "Authenticated update for product images" ON storage.objects;
DROP POLICY "Authenticated update for category images" ON storage.objects;
DROP POLICY "Authenticated update for brand images" ON storage.objects;
DROP POLICY "Authenticated delete for user avatars" ON storage.objects;
DROP POLICY "Authenticated delete for product images" ON storage.objects;
DROP POLICY "Authenticated delete for category images" ON storage.objects;
DROP POLICY "Authenticated delete for brand images" ON storage.objects;
DROP POLICY "Actualizar imágenes productos - propietario" ON storage.objects;
DROP POLICY authenticated_users_can_write_usuario_rol ON public.usuario_rol;
DROP POLICY authenticated_users_can_write_usuario ON public.usuario;
DROP POLICY authenticated_users_can_write_unidad ON public.unidad;
DROP POLICY authenticated_users_can_write_rol ON public.rol;
DROP POLICY authenticated_users_can_write_proveedor ON public.proveedor;
DROP POLICY authenticated_users_can_write_producto ON public.producto;
DROP POLICY authenticated_users_can_write_moneda ON public.moneda;
DROP POLICY authenticated_users_can_write_marca ON public.marca;
DROP POLICY authenticated_users_can_write_disponibilidad ON public.disponibilidad;
DROP POLICY authenticated_users_can_write_categoria ON public.categoria;
DROP POLICY authenticated_users_can_read_usuario_rol ON public.usuario_rol;
DROP POLICY authenticated_users_can_read_usuario ON public.usuario;
DROP POLICY authenticated_users_can_read_unidad ON public.unidad;
DROP POLICY authenticated_users_can_read_rol ON public.rol;
DROP POLICY authenticated_users_can_read_proveedor ON public.proveedor;
DROP POLICY authenticated_users_can_read_producto ON public.producto;
DROP POLICY authenticated_users_can_read_moneda ON public.moneda;
DROP POLICY authenticated_users_can_read_marca ON public.marca;
DROP POLICY authenticated_users_can_read_disponibilidad ON public.disponibilidad;
DROP POLICY authenticated_users_can_read_categoria ON public.categoria;
DROP POLICY "Usuarios autenticados pueden leer usuarios" ON public.usuario;
DROP POLICY "Usuarios autenticados pueden leer usuario_rol" ON public.usuario_rol;
DROP POLICY "Usuarios autenticados pueden leer unidades" ON public.unidad;
DROP POLICY "Usuarios autenticados pueden leer roles" ON public.rol;
DROP POLICY "Usuarios autenticados pueden leer proveedores" ON public.proveedor;
DROP POLICY "Usuarios autenticados pueden leer productos" ON public.producto;
DROP POLICY "Usuarios autenticados pueden leer monedas" ON public.moneda;
DROP POLICY "Usuarios autenticados pueden leer marcas" ON public.marca;
DROP POLICY "Usuarios autenticados pueden leer disponibilidad" ON public.disponibilidad;
DROP POLICY "Usuarios autenticados pueden leer clientes" ON public.cliente;
DROP POLICY "Usuarios autenticados pueden leer categorias" ON public.categoria;
DROP POLICY "Usuarios autenticados pueden crear proveedores" ON public.proveedor;
DROP POLICY "Usuarios autenticados pueden crear productos" ON public.producto;
DROP POLICY "Usuarios autenticados pueden crear marcas" ON public.marca;
DROP POLICY "Usuarios autenticados pueden crear clientes" ON public.cliente;
DROP POLICY "Usuarios autenticados pueden crear categorias" ON public.categoria;
DROP POLICY "Usuarios autenticados pueden actualizar usuarios" ON public.usuario;
DROP POLICY "Usuarios autenticados pueden actualizar productos" ON public.producto;
DROP POLICY "Allow public read access to pais" ON public.pais;
DROP POLICY "Allow public read access to moneda" ON public.moneda;
DROP POLICY "Allow public read access to marca" ON public.marca;
ALTER TABLE ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE ONLY storage.s3_multipart_uploads DROP CONSTRAINT s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE ONLY storage.prefixes DROP CONSTRAINT "prefixes_bucketId_fkey";
ALTER TABLE ONLY storage.objects DROP CONSTRAINT "objects_bucketId_fkey";
ALTER TABLE ONLY public.usuario_rol DROP CONSTRAINT usuario_rol_id_usuario_fkey;
ALTER TABLE ONLY public.usuario_rol DROP CONSTRAINT usuario_rol_id_rol_fkey;
ALTER TABLE ONLY public.usuario_rol DROP CONSTRAINT usuario_rol_asignado_por_fkey;
ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_auth_user_id_fkey;
ALTER TABLE ONLY public.transicion_estado_cotizacion DROP CONSTRAINT transicion_estado_cotizacion_usuario_responsable_fkey;
ALTER TABLE ONLY public.transicion_estado_cotizacion DROP CONSTRAINT transicion_estado_cotizacion_id_cotizacion_fkey;
ALTER TABLE ONLY public.transicion_estado_cotizacion DROP CONSTRAINT transicion_estado_cotizacion_estado_nuevo_id_fkey;
ALTER TABLE ONLY public.transicion_estado_cotizacion DROP CONSTRAINT transicion_estado_cotizacion_estado_anterior_id_fkey;
ALTER TABLE ONLY public.solicitud_cotizacion DROP CONSTRAINT solicitud_cotizacion_id_cliente_creado_fkey;
ALTER TABLE ONLY public.solicitud_cotizacion DROP CONSTRAINT solicitud_cotizacion_id_asesor_asignado_fkey;
ALTER TABLE ONLY public.solicitud_cotizacion DROP CONSTRAINT solicitud_cotizacion_creado_por_fkey;
ALTER TABLE ONLY public.solicitud_archivo DROP CONSTRAINT solicitud_archivo_id_solicitud_cotizacion_fkey;
ALTER TABLE ONLY public.recogedores DROP CONSTRAINT recogedores_id_vehicle_type_fkey;
ALTER TABLE ONLY public.proveedor_marca DROP CONSTRAINT proveedor_marca_id_proveedor_fkey;
ALTER TABLE ONLY public.proveedor_marca DROP CONSTRAINT proveedor_marca_id_marca_fkey;
ALTER TABLE ONLY public.proveedor DROP CONSTRAINT proveedor_id_pais_fkey;
ALTER TABLE ONLY public.proveedor DROP CONSTRAINT proveedor_id_condiciones_comerciales_fkey;
ALTER TABLE ONLY public.proveedor DROP CONSTRAINT proveedor_id_ciudad_fkey;
ALTER TABLE ONLY public.proveedor_categoria DROP CONSTRAINT proveedor_categoria_id_proveedor_fkey;
ALTER TABLE ONLY public.proveedor_categoria DROP CONSTRAINT proveedor_categoria_id_categoria_fkey;
ALTER TABLE ONLY public.promocion_uso DROP CONSTRAINT promocion_uso_id_promocion_fkey;
ALTER TABLE ONLY public.promocion_uso DROP CONSTRAINT promocion_uso_id_cliente_fkey;
ALTER TABLE ONLY public.promocion_descuento DROP CONSTRAINT promocion_descuento_id_promocion_fkey;
ALTER TABLE ONLY public.promocion DROP CONSTRAINT promocion_creado_por_fkey;
ALTER TABLE ONLY public.producto_proveedor DROP CONSTRAINT producto_proveedor_sku_fkey;
ALTER TABLE ONLY public.producto_proveedor DROP CONSTRAINT producto_proveedor_id_proveedor_fkey;
ALTER TABLE ONLY public.producto_proveedor DROP CONSTRAINT producto_proveedor_id_moneda_costo_fkey;
ALTER TABLE ONLY public.producto_precio_moneda DROP CONSTRAINT producto_precio_moneda_sku_fkey;
ALTER TABLE ONLY public.producto_precio_moneda DROP CONSTRAINT producto_precio_moneda_id_moneda_fkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_id_unidad_fkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_id_proveedor_principal_fkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_id_moneda_venta_fkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_id_moneda_referencia_fkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_id_moneda_costo_fkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_id_marca_fkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_id_disponibilidad_fkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_id_categoria_fkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_creado_por_fkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_actualizado_por_fkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_id_moneda_fkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_id_forma_pago_fkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_id_direccion_facturacion_fkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_id_direccion_envio_fkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_id_cotizacion_fkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_id_condiciones_comerciales_fkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_id_cliente_fkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_id_asesor_ventas_fkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_id_asesor_fkey;
ALTER TABLE ONLY public.pedido_detalle DROP CONSTRAINT pedido_detalle_sku_fkey;
ALTER TABLE ONLY public.pedido_detalle DROP CONSTRAINT pedido_detalle_id_proveedor_asignado_fkey;
ALTER TABLE ONLY public.pedido_detalle DROP CONSTRAINT pedido_detalle_id_pedido_fkey;
ALTER TABLE ONLY public.pais DROP CONSTRAINT pais_id_moneda_principal_fkey;
ALTER TABLE ONLY public.pago_recibido DROP CONSTRAINT pago_recibido_registrado_por_fkey;
ALTER TABLE ONLY public.pago_recibido DROP CONSTRAINT pago_recibido_recibido_por_fkey;
ALTER TABLE ONLY public.pago_recibido DROP CONSTRAINT pago_recibido_id_moneda_fkey;
ALTER TABLE ONLY public.pago_recibido DROP CONSTRAINT pago_recibido_id_forma_pago_fkey;
ALTER TABLE ONLY public.pago_recibido DROP CONSTRAINT pago_recibido_id_cuenta_por_cobrar_fkey;
ALTER TABLE ONLY public.pago_recibido DROP CONSTRAINT pago_recibido_id_cliente_fkey;
ALTER TABLE ONLY public.oportunidad DROP CONSTRAINT oportunidad_id_solicitud_cotizacion_fkey;
ALTER TABLE ONLY public.oportunidad DROP CONSTRAINT oportunidad_id_moneda_valor_fkey;
ALTER TABLE ONLY public.oportunidad DROP CONSTRAINT oportunidad_id_etapa_fkey;
ALTER TABLE ONLY public.oportunidad DROP CONSTRAINT oportunidad_id_cliente_fkey;
ALTER TABLE ONLY public.oportunidad DROP CONSTRAINT oportunidad_id_asesor_fkey;
ALTER TABLE ONLY public.marca_categoria DROP CONSTRAINT marca_categoria_id_marca_fkey;
ALTER TABLE ONLY public.marca_categoria DROP CONSTRAINT marca_categoria_id_categoria_fkey;
ALTER TABLE ONLY public.inversion_categoria DROP CONSTRAINT inversion_categoria_id_moneda_fkey;
ALTER TABLE ONLY public.inversion_categoria DROP CONSTRAINT inversion_categoria_id_categoria_fkey;
ALTER TABLE ONLY public.historial_precios DROP CONSTRAINT historial_precios_usuario_responsable_fkey;
ALTER TABLE ONLY public.historial_precios DROP CONSTRAINT historial_precios_sku_fkey;
ALTER TABLE ONLY public.historial_precios DROP CONSTRAINT historial_precios_referencia_cotizacion_fkey;
ALTER TABLE ONLY public.historial_precios DROP CONSTRAINT historial_precios_id_usuario_fkey;
ALTER TABLE ONLY public.historial_precios DROP CONSTRAINT historial_precios_id_proveedor_fkey;
ALTER TABLE ONLY public.historial_precios DROP CONSTRAINT historial_precios_id_moneda_fkey;
ALTER TABLE ONLY public.solicitud_cotizacion DROP CONSTRAINT fk_solicitud_cotizacion_generada;
ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_id_pedido_fkey;
ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_id_moneda_fkey;
ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_id_forma_pago_fkey;
ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_id_empresa_emisora_fkey;
ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_id_cliente_fkey;
ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_facturado_por_fkey;
ALTER TABLE ONLY public.factura_detalle DROP CONSTRAINT factura_detalle_sku_fkey;
ALTER TABLE ONLY public.factura_detalle DROP CONSTRAINT factura_detalle_id_factura_fkey;
ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_creado_por_fkey;
ALTER TABLE ONLY public.factoring_operacion DROP CONSTRAINT factoring_operacion_id_factura_fkey;
ALTER TABLE ONLY public.empresa_emisora DROP CONSTRAINT empresa_emisora_id_pais_fkey;
ALTER TABLE ONLY public.distrito DROP CONSTRAINT distrito_id_ciudad_fkey;
ALTER TABLE ONLY public.direccion_cliente DROP CONSTRAINT direccion_cliente_id_pais_fkey;
ALTER TABLE ONLY public.direccion_cliente DROP CONSTRAINT direccion_cliente_id_distrito_fkey;
ALTER TABLE ONLY public.direccion_cliente DROP CONSTRAINT direccion_cliente_id_cliente_fkey;
ALTER TABLE ONLY public.direccion_cliente DROP CONSTRAINT direccion_cliente_id_ciudad_fkey;
ALTER TABLE ONLY public.detalle_solicitud_cotizacion DROP CONSTRAINT detalle_solicitud_cotizacion_sku_fkey;
ALTER TABLE ONLY public.detalle_solicitud_cotizacion DROP CONSTRAINT detalle_solicitud_cotizacion_id_solicitud_cotizacion_fkey;
ALTER TABLE ONLY public.cuenta_por_cobrar DROP CONSTRAINT cuenta_por_cobrar_id_moneda_fkey;
ALTER TABLE ONLY public.cuenta_por_cobrar DROP CONSTRAINT cuenta_por_cobrar_id_gestor_fkey;
ALTER TABLE ONLY public.cuenta_por_cobrar DROP CONSTRAINT cuenta_por_cobrar_id_factura_fkey;
ALTER TABLE ONLY public.cuenta_por_cobrar DROP CONSTRAINT cuenta_por_cobrar_id_cliente_fkey;
ALTER TABLE ONLY public.cuenta_por_cobrar DROP CONSTRAINT cuenta_por_cobrar_gestor_cobranza_fkey;
ALTER TABLE ONLY public.crowdlending_operacion DROP CONSTRAINT crowdlending_operacion_id_pedido_fkey;
ALTER TABLE ONLY public.crowdlending_operacion DROP CONSTRAINT crowdlending_operacion_id_cliente_fkey;
ALTER TABLE ONLY public.crm_nota DROP CONSTRAINT crm_nota_modificado_por_fkey;
ALTER TABLE ONLY public.crm_nota DROP CONSTRAINT crm_nota_id_oportunidad_fkey;
ALTER TABLE ONLY public.crm_nota DROP CONSTRAINT crm_nota_id_cliente_fkey;
ALTER TABLE ONLY public.crm_nota DROP CONSTRAINT crm_nota_id_actividad_fkey;
ALTER TABLE ONLY public.crm_nota DROP CONSTRAINT crm_nota_creado_por_fkey;
ALTER TABLE ONLY public.crm_actividad DROP CONSTRAINT crm_actividad_id_usuario_responsable_fkey;
ALTER TABLE ONLY public.crm_actividad DROP CONSTRAINT crm_actividad_id_usuario_fkey;
ALTER TABLE ONLY public.crm_actividad DROP CONSTRAINT crm_actividad_id_solicitud_cotizacion_fkey;
ALTER TABLE ONLY public.crm_actividad DROP CONSTRAINT crm_actividad_id_oportunidad_fkey;
ALTER TABLE ONLY public.crm_actividad DROP CONSTRAINT crm_actividad_id_cliente_fkey;
ALTER TABLE ONLY public.crm_actividad DROP CONSTRAINT crm_actividad_creado_por_fkey;
ALTER TABLE ONLY public.cotizacion DROP CONSTRAINT cotizacion_id_moneda_cotizacion_fkey;
ALTER TABLE ONLY public.cotizacion DROP CONSTRAINT cotizacion_id_forma_pago_fkey;
ALTER TABLE ONLY public.cotizacion DROP CONSTRAINT cotizacion_id_estado_fkey;
ALTER TABLE ONLY public.cotizacion DROP CONSTRAINT cotizacion_id_disponibilidad_fkey;
ALTER TABLE ONLY public.cotizacion DROP CONSTRAINT cotizacion_id_condiciones_comerciales_fkey;
ALTER TABLE ONLY public.cotizacion DROP CONSTRAINT cotizacion_id_cliente_fkey;
ALTER TABLE ONLY public.cotizacion DROP CONSTRAINT cotizacion_id_asesor_ventas_fkey;
ALTER TABLE ONLY public.cotizacion_detalle DROP CONSTRAINT cotizacion_detalle_sku_fkey;
ALTER TABLE ONLY public.cotizacion_detalle DROP CONSTRAINT cotizacion_detalle_id_proveedor_principal_fkey;
ALTER TABLE ONLY public.cotizacion_detalle DROP CONSTRAINT cotizacion_detalle_id_proveedor_fkey;
ALTER TABLE ONLY public.cotizacion_detalle DROP CONSTRAINT cotizacion_detalle_id_moneda_costo_proveedor_fkey;
ALTER TABLE ONLY public.cotizacion_detalle DROP CONSTRAINT cotizacion_detalle_id_cotizacion_fkey;
ALTER TABLE ONLY public.cotizacion DROP CONSTRAINT cotizacion_creado_por_fkey;
ALTER TABLE ONLY public.costos_operativos DROP CONSTRAINT costos_operativos_responsable_fkey;
ALTER TABLE ONLY public.costos_operativos DROP CONSTRAINT costos_operativos_id_moneda_fkey;
ALTER TABLE ONLY public.configuracion_fe DROP CONSTRAINT configuracion_fe_id_pais_fkey;
ALTER TABLE ONLY public.configuracion_fe DROP CONSTRAINT configuracion_fe_configurado_por_fkey;
ALTER TABLE ONLY public.condiciones_comerciales DROP CONSTRAINT condiciones_comerciales_id_moneda_min_pedido_fkey;
ALTER TABLE ONLY public.comunicacion_solicitud DROP CONSTRAINT comunicacion_solicitud_id_usuario_fkey;
ALTER TABLE ONLY public.comunicacion_solicitud DROP CONSTRAINT comunicacion_solicitud_id_solicitud_cotizacion_fkey;
ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_id_tipo_contacto_fkey;
ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_id_tipo_cliente_fkey;
ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_id_rubro_fkey;
ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_id_pais_fkey;
ALTER TABLE ONLY public.ciudad DROP CONSTRAINT ciudad_id_pais_fkey;
ALTER TABLE ONLY public.carrito_compra DROP CONSTRAINT carrito_compra_sku_fkey;
ALTER TABLE ONLY public.carrito_compra DROP CONSTRAINT carrito_compra_id_moneda_precio_fkey;
ALTER TABLE ONLY public.carrito_compra DROP CONSTRAINT carrito_compra_id_cliente_fkey;
ALTER TABLE ONLY auth.sso_domains DROP CONSTRAINT sso_domains_sso_provider_id_fkey;
ALTER TABLE ONLY auth.sessions DROP CONSTRAINT sessions_user_id_fkey;
ALTER TABLE ONLY auth.saml_relay_states DROP CONSTRAINT saml_relay_states_sso_provider_id_fkey;
ALTER TABLE ONLY auth.saml_relay_states DROP CONSTRAINT saml_relay_states_flow_state_id_fkey;
ALTER TABLE ONLY auth.saml_providers DROP CONSTRAINT saml_providers_sso_provider_id_fkey;
ALTER TABLE ONLY auth.refresh_tokens DROP CONSTRAINT refresh_tokens_session_id_fkey;
ALTER TABLE ONLY auth.one_time_tokens DROP CONSTRAINT one_time_tokens_user_id_fkey;
ALTER TABLE ONLY auth.mfa_factors DROP CONSTRAINT mfa_factors_user_id_fkey;
ALTER TABLE ONLY auth.mfa_challenges DROP CONSTRAINT mfa_challenges_auth_factor_id_fkey;
ALTER TABLE ONLY auth.mfa_amr_claims DROP CONSTRAINT mfa_amr_claims_session_id_fkey;
ALTER TABLE ONLY auth.identities DROP CONSTRAINT identities_user_id_fkey;
DROP TRIGGER update_objects_updated_at ON storage.objects;
DROP TRIGGER prefixes_delete_cleanup ON storage.prefixes;
DROP TRIGGER prefixes_create_hierarchy ON storage.prefixes;
DROP TRIGGER objects_update_cleanup ON storage.objects;
DROP TRIGGER objects_insert_create_prefix ON storage.objects;
DROP TRIGGER objects_delete_cleanup ON storage.objects;
DROP TRIGGER enforce_bucket_name_length_trigger ON storage.buckets;
DROP TRIGGER tr_check_filters ON realtime.subscription;
DROP TRIGGER update_vehicle_types_modtime ON public.vehicle_types;
DROP TRIGGER update_recogedores_modtime ON public.recogedores;
DROP TRIGGER trigger_validar_margen_producto ON public.producto;
DROP TRIGGER trigger_calcular_precio_multimoneda ON public.producto;
DROP TRIGGER trg_usuario_fecha_actualizacion ON public.usuario;
DROP TRIGGER trg_producto_proveedor_fecha_actualizacion ON public.producto_proveedor;
DROP TRIGGER trg_producto_fecha_actualizacion ON public.producto;
DROP TRIGGER trg_generar_codigo_solicitud ON public.solicitud_cotizacion;
DROP TRIGGER trg_cotizacion_primera_transicion ON public.cotizacion;
DROP TRIGGER trg_cotizacion_fecha_actualizacion ON public.cotizacion;
DROP TRIGGER trg_cotizacion_cambio_estado ON public.cotizacion;
DROP TRIGGER trg_calcular_dias_vencimiento ON public.cuenta_por_cobrar;
DROP INDEX storage.objects_bucket_id_level_idx;
DROP INDEX storage.name_prefix_search;
DROP INDEX storage.idx_prefixes_lower_name;
DROP INDEX storage.idx_objects_lower_name;
DROP INDEX storage.idx_objects_bucket_id_name;
DROP INDEX storage.idx_name_bucket_level_unique;
DROP INDEX storage.idx_multipart_uploads_list;
DROP INDEX storage.bucketid_objname;
DROP INDEX storage.bname;
DROP INDEX realtime.subscription_subscription_id_entity_filters_key;
DROP INDEX realtime.messages_inserted_at_topic_index;
DROP INDEX realtime.ix_realtime_subscription_entity;
DROP INDEX public.unique_sku_moneda_activo_idx;
DROP INDEX public.idx_transicion_usuario;
DROP INDEX public.idx_transicion_fecha;
DROP INDEX public.idx_transicion_estados;
DROP INDEX public.idx_transicion_cotizacion;
DROP INDEX public.idx_transicion_automatico;
DROP INDEX public.idx_transicion_analisis;
DROP INDEX public.idx_solicitud_fecha;
DROP INDEX public.idx_solicitud_estado;
DROP INDEX public.idx_solicitud_asesor;
DROP INDEX public.idx_producto_visible_web;
DROP INDEX public.idx_producto_proveedor_sku;
DROP INDEX public.idx_producto_proveedor_proveedor;
DROP INDEX public.idx_producto_proveedor_principal;
DROP INDEX public.idx_producto_precio_sku;
DROP INDEX public.idx_producto_precio_moneda_id;
DROP INDEX public.idx_producto_precio_activo;
DROP INDEX public.idx_producto_nombre_trgm;
DROP INDEX public.idx_producto_marca;
DROP INDEX public.idx_producto_categoria;
DROP INDEX public.idx_oportunidad_etapa;
DROP INDEX public.idx_oportunidad_asesor;
DROP INDEX public.idx_historial_precios_sku;
DROP INDEX public.idx_historial_precios_fecha;
DROP INDEX public.idx_factura_fecha;
DROP INDEX public.idx_factura_estado;
DROP INDEX public.idx_factura_cliente;
DROP INDEX public.idx_estado_cotizacion_final;
DROP INDEX public.idx_estado_cotizacion_exitoso;
DROP INDEX public.idx_estado_cotizacion_activo;
DROP INDEX public.idx_crm_actividad_usuario;
DROP INDEX public.idx_crm_actividad_fecha;
DROP INDEX public.idx_cotizacion_fecha_emision;
DROP INDEX public.idx_cotizacion_cliente;
DROP INDEX public.idx_cliente_tipo;
DROP INDEX public.idx_cliente_ruc;
DROP INDEX public.idx_cliente_email;
DROP INDEX auth.users_is_anonymous_idx;
DROP INDEX auth.users_instance_id_idx;
DROP INDEX auth.users_instance_id_email_idx;
DROP INDEX auth.users_email_partial_key;
DROP INDEX auth.user_id_created_at_idx;
DROP INDEX auth.unique_phone_factor_per_user;
DROP INDEX auth.sso_providers_resource_id_pattern_idx;
DROP INDEX auth.sso_providers_resource_id_idx;
DROP INDEX auth.sso_domains_sso_provider_id_idx;
DROP INDEX auth.sso_domains_domain_idx;
DROP INDEX auth.sessions_user_id_idx;
DROP INDEX auth.sessions_not_after_idx;
DROP INDEX auth.saml_relay_states_sso_provider_id_idx;
DROP INDEX auth.saml_relay_states_for_email_idx;
DROP INDEX auth.saml_relay_states_created_at_idx;
DROP INDEX auth.saml_providers_sso_provider_id_idx;
DROP INDEX auth.refresh_tokens_updated_at_idx;
DROP INDEX auth.refresh_tokens_session_id_revoked_idx;
DROP INDEX auth.refresh_tokens_parent_idx;
DROP INDEX auth.refresh_tokens_instance_id_user_id_idx;
DROP INDEX auth.refresh_tokens_instance_id_idx;
DROP INDEX auth.recovery_token_idx;
DROP INDEX auth.reauthentication_token_idx;
DROP INDEX auth.one_time_tokens_user_id_token_type_key;
DROP INDEX auth.one_time_tokens_token_hash_hash_idx;
DROP INDEX auth.one_time_tokens_relates_to_hash_idx;
DROP INDEX auth.oauth_clients_deleted_at_idx;
DROP INDEX auth.oauth_clients_client_id_idx;
DROP INDEX auth.mfa_factors_user_id_idx;
DROP INDEX auth.mfa_factors_user_friendly_name_unique;
DROP INDEX auth.mfa_challenge_created_at_idx;
DROP INDEX auth.idx_user_id_auth_method;
DROP INDEX auth.idx_auth_code;
DROP INDEX auth.identities_user_id_idx;
DROP INDEX auth.identities_email_idx;
DROP INDEX auth.flow_state_created_at_idx;
DROP INDEX auth.factor_id_created_at_idx;
DROP INDEX auth.email_change_token_new_idx;
DROP INDEX auth.email_change_token_current_idx;
DROP INDEX auth.confirmation_token_idx;
DROP INDEX auth.audit_logs_instance_id_idx;
ALTER TABLE ONLY storage.s3_multipart_uploads DROP CONSTRAINT s3_multipart_uploads_pkey;
ALTER TABLE ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT s3_multipart_uploads_parts_pkey;
ALTER TABLE ONLY storage.prefixes DROP CONSTRAINT prefixes_pkey;
ALTER TABLE ONLY storage.objects DROP CONSTRAINT objects_pkey;
ALTER TABLE ONLY storage.migrations DROP CONSTRAINT migrations_pkey;
ALTER TABLE ONLY storage.migrations DROP CONSTRAINT migrations_name_key;
ALTER TABLE ONLY storage.buckets DROP CONSTRAINT buckets_pkey;
ALTER TABLE ONLY storage.buckets_analytics DROP CONSTRAINT buckets_analytics_pkey;
ALTER TABLE ONLY realtime.schema_migrations DROP CONSTRAINT schema_migrations_pkey;
ALTER TABLE ONLY realtime.subscription DROP CONSTRAINT pk_subscription;
ALTER TABLE ONLY realtime.messages_2025_09_28 DROP CONSTRAINT messages_2025_09_28_pkey;
ALTER TABLE ONLY realtime.messages_2025_09_27 DROP CONSTRAINT messages_2025_09_27_pkey;
ALTER TABLE ONLY realtime.messages_2025_09_26 DROP CONSTRAINT messages_2025_09_26_pkey;
ALTER TABLE ONLY realtime.messages_2025_09_25 DROP CONSTRAINT messages_2025_09_25_pkey;
ALTER TABLE ONLY realtime.messages_2025_09_24 DROP CONSTRAINT messages_2025_09_24_pkey;
ALTER TABLE ONLY realtime.messages_2025_09_23 DROP CONSTRAINT messages_2025_09_23_pkey;
ALTER TABLE ONLY realtime.messages_2025_09_22 DROP CONSTRAINT messages_2025_09_22_pkey;
ALTER TABLE ONLY realtime.messages DROP CONSTRAINT messages_pkey;
ALTER TABLE ONLY public.vehicle_types DROP CONSTRAINT vehicle_types_pkey;
ALTER TABLE ONLY public.vehicle_types DROP CONSTRAINT vehicle_types_nombre_key;
ALTER TABLE ONLY public.usuario_rol DROP CONSTRAINT usuario_rol_pkey;
ALTER TABLE ONLY public.usuario_rol DROP CONSTRAINT usuario_rol_id_usuario_id_rol_key;
ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
ALTER TABLE ONLY public.unidad DROP CONSTRAINT unidad_pkey;
ALTER TABLE ONLY public.unidad DROP CONSTRAINT unidad_codigo_key;
ALTER TABLE ONLY public.transicion_estado_cotizacion DROP CONSTRAINT transicion_estado_cotizacion_pkey;
ALTER TABLE ONLY public.tipo_contacto DROP CONSTRAINT tipo_contacto_pkey;
ALTER TABLE ONLY public.tipo_contacto DROP CONSTRAINT tipo_contacto_codigo_key;
ALTER TABLE ONLY public.tipo_cliente DROP CONSTRAINT tipo_cliente_pkey;
ALTER TABLE ONLY public.solicitud_cotizacion DROP CONSTRAINT solicitud_cotizacion_pkey;
ALTER TABLE ONLY public.solicitud_cotizacion DROP CONSTRAINT solicitud_cotizacion_codigo_key;
ALTER TABLE ONLY public.solicitud_archivo DROP CONSTRAINT solicitud_archivo_pkey;
ALTER TABLE ONLY public.rubro DROP CONSTRAINT rubro_pkey;
ALTER TABLE ONLY public.rubro DROP CONSTRAINT rubro_codigo_key;
ALTER TABLE ONLY public.rol DROP CONSTRAINT rol_pkey;
ALTER TABLE ONLY public.rol DROP CONSTRAINT rol_nombre_key;
ALTER TABLE ONLY public.recogedores DROP CONSTRAINT recogedores_pkey;
ALTER TABLE ONLY public.recogedores DROP CONSTRAINT recogedores_correo_key;
ALTER TABLE ONLY public.proveedor DROP CONSTRAINT proveedor_pkey;
ALTER TABLE ONLY public.proveedor_marca DROP CONSTRAINT proveedor_marca_pkey;
ALTER TABLE ONLY public.proveedor DROP CONSTRAINT proveedor_documento_empresa_key;
ALTER TABLE ONLY public.proveedor DROP CONSTRAINT proveedor_codigo_key;
ALTER TABLE ONLY public.proveedor_categoria DROP CONSTRAINT proveedor_categoria_pkey;
ALTER TABLE ONLY public.promocion_uso DROP CONSTRAINT promocion_uso_pkey;
ALTER TABLE ONLY public.promocion DROP CONSTRAINT promocion_pkey;
ALTER TABLE ONLY public.promocion_descuento DROP CONSTRAINT promocion_descuento_pkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_seo_slug_key;
ALTER TABLE ONLY public.producto_proveedor DROP CONSTRAINT producto_proveedor_sku_id_proveedor_key;
ALTER TABLE ONLY public.producto_proveedor DROP CONSTRAINT producto_proveedor_pkey;
ALTER TABLE ONLY public.producto_precio_moneda DROP CONSTRAINT producto_precio_moneda_pkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_pkey;
ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_codigo_key;
ALTER TABLE ONLY public.procesamiento_archivo_log DROP CONSTRAINT procesamiento_archivo_log_pkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_pkey;
ALTER TABLE ONLY public.pedido DROP CONSTRAINT pedido_numero_key;
ALTER TABLE ONLY public.pedido_detalle DROP CONSTRAINT pedido_detalle_pkey;
ALTER TABLE ONLY public.pedido_detalle DROP CONSTRAINT pedido_detalle_id_pedido_item_key;
ALTER TABLE ONLY public.pais DROP CONSTRAINT pais_pkey;
ALTER TABLE ONLY public.pais DROP CONSTRAINT pais_iso_code_key;
ALTER TABLE ONLY public.pais DROP CONSTRAINT pais_iso_code_2_key;
ALTER TABLE ONLY public.pais DROP CONSTRAINT pais_codigo_key;
ALTER TABLE ONLY public.pago_recibido DROP CONSTRAINT pago_recibido_pkey;
ALTER TABLE ONLY public.pago_recibido DROP CONSTRAINT pago_recibido_numero_recibo_key;
ALTER TABLE ONLY public.oportunidad DROP CONSTRAINT oportunidad_pkey;
ALTER TABLE ONLY public.moneda DROP CONSTRAINT moneda_pkey;
ALTER TABLE ONLY public.moneda DROP CONSTRAINT moneda_codigo_key;
ALTER TABLE ONLY public.marca DROP CONSTRAINT marca_pkey;
ALTER TABLE ONLY public.marca DROP CONSTRAINT marca_codigo_key;
ALTER TABLE ONLY public.marca_categoria DROP CONSTRAINT marca_categoria_pkey;
ALTER TABLE ONLY public.inversion_categoria DROP CONSTRAINT inversion_categoria_pkey;
ALTER TABLE ONLY public.historial_precios DROP CONSTRAINT historial_precios_pkey;
ALTER TABLE ONLY public.forma_pago DROP CONSTRAINT forma_pago_pkey;
ALTER TABLE ONLY public.forma_pago DROP CONSTRAINT forma_pago_codigo_key;
ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_pkey;
ALTER TABLE ONLY public.factura DROP CONSTRAINT factura_numero_key;
ALTER TABLE ONLY public.factura_detalle DROP CONSTRAINT factura_detalle_pkey;
ALTER TABLE ONLY public.factura_detalle DROP CONSTRAINT factura_detalle_id_factura_item_key;
ALTER TABLE ONLY public.factoring_operacion DROP CONSTRAINT factoring_operacion_pkey;
ALTER TABLE ONLY public.estado_cotizacion DROP CONSTRAINT estado_cotizacion_pkey;
ALTER TABLE ONLY public.estado_cotizacion DROP CONSTRAINT estado_cotizacion_codigo_key;
ALTER TABLE ONLY public.empresa_emisora DROP CONSTRAINT empresa_emisora_ruc_key;
ALTER TABLE ONLY public.empresa_emisora DROP CONSTRAINT empresa_emisora_pkey;
ALTER TABLE ONLY public.distrito DROP CONSTRAINT distrito_pkey;
ALTER TABLE ONLY public.disponibilidad DROP CONSTRAINT disponibilidad_pkey;
ALTER TABLE ONLY public.disponibilidad DROP CONSTRAINT disponibilidad_codigo_key;
ALTER TABLE ONLY public.direccion_cliente DROP CONSTRAINT direccion_cliente_pkey;
ALTER TABLE ONLY public.detalle_solicitud_cotizacion DROP CONSTRAINT detalle_solicitud_cotizacion_pkey;
ALTER TABLE ONLY public.detalle_solicitud_cotizacion DROP CONSTRAINT detalle_solicitud_cotizacion_id_solicitud_cotizacion_item_key;
ALTER TABLE ONLY public.cuenta_por_cobrar DROP CONSTRAINT cuenta_por_cobrar_pkey;
ALTER TABLE ONLY public.cuenta_por_cobrar DROP CONSTRAINT cuenta_por_cobrar_numero_documento_key;
ALTER TABLE ONLY public.crowdlending_operacion DROP CONSTRAINT crowdlending_operacion_pkey;
ALTER TABLE ONLY public.crm_nota DROP CONSTRAINT crm_nota_pkey;
ALTER TABLE ONLY public.crm_etapa DROP CONSTRAINT crm_etapa_pkey;
ALTER TABLE ONLY public.crm_etapa DROP CONSTRAINT crm_etapa_nombre_key;
ALTER TABLE ONLY public.crm_actividad DROP CONSTRAINT crm_actividad_pkey;
ALTER TABLE ONLY public.cotizacion DROP CONSTRAINT cotizacion_pkey;
ALTER TABLE ONLY public.cotizacion DROP CONSTRAINT cotizacion_numero_key;
ALTER TABLE ONLY public.cotizacion_detalle DROP CONSTRAINT cotizacion_detalle_pkey;
ALTER TABLE ONLY public.cotizacion_detalle DROP CONSTRAINT cotizacion_detalle_id_cotizacion_item_key;
ALTER TABLE ONLY public.costos_operativos DROP CONSTRAINT costos_operativos_pkey;
ALTER TABLE ONLY public.configuracion_sistema DROP CONSTRAINT configuracion_sistema_pkey;
ALTER TABLE ONLY public.configuracion_fe DROP CONSTRAINT configuracion_fe_pkey;
ALTER TABLE ONLY public.configuracion_archivos DROP CONSTRAINT configuracion_archivos_pkey;
ALTER TABLE ONLY public.condiciones_comerciales DROP CONSTRAINT condiciones_comerciales_pkey;
ALTER TABLE ONLY public.condiciones_comerciales DROP CONSTRAINT condiciones_comerciales_codigo_key;
ALTER TABLE ONLY public.comunicacion_solicitud DROP CONSTRAINT comunicacion_solicitud_pkey;
ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_pkey;
ALTER TABLE ONLY public.ciudad DROP CONSTRAINT ciudad_pkey;
ALTER TABLE ONLY public.categoria DROP CONSTRAINT categoria_pkey;
ALTER TABLE ONLY public.carrito_compra DROP CONSTRAINT carrito_compra_pkey;
ALTER TABLE ONLY auth.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY auth.users DROP CONSTRAINT users_phone_key;
ALTER TABLE ONLY auth.sso_providers DROP CONSTRAINT sso_providers_pkey;
ALTER TABLE ONLY auth.sso_domains DROP CONSTRAINT sso_domains_pkey;
ALTER TABLE ONLY auth.sessions DROP CONSTRAINT sessions_pkey;
ALTER TABLE ONLY auth.schema_migrations DROP CONSTRAINT schema_migrations_pkey;
ALTER TABLE ONLY auth.saml_relay_states DROP CONSTRAINT saml_relay_states_pkey;
ALTER TABLE ONLY auth.saml_providers DROP CONSTRAINT saml_providers_pkey;
ALTER TABLE ONLY auth.saml_providers DROP CONSTRAINT saml_providers_entity_id_key;
ALTER TABLE ONLY auth.refresh_tokens DROP CONSTRAINT refresh_tokens_token_unique;
ALTER TABLE ONLY auth.refresh_tokens DROP CONSTRAINT refresh_tokens_pkey;
ALTER TABLE ONLY auth.one_time_tokens DROP CONSTRAINT one_time_tokens_pkey;
ALTER TABLE ONLY auth.oauth_clients DROP CONSTRAINT oauth_clients_pkey;
ALTER TABLE ONLY auth.oauth_clients DROP CONSTRAINT oauth_clients_client_id_key;
ALTER TABLE ONLY auth.mfa_factors DROP CONSTRAINT mfa_factors_pkey;
ALTER TABLE ONLY auth.mfa_factors DROP CONSTRAINT mfa_factors_last_challenged_at_key;
ALTER TABLE ONLY auth.mfa_challenges DROP CONSTRAINT mfa_challenges_pkey;
ALTER TABLE ONLY auth.mfa_amr_claims DROP CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey;
ALTER TABLE ONLY auth.instances DROP CONSTRAINT instances_pkey;
ALTER TABLE ONLY auth.identities DROP CONSTRAINT identities_provider_id_provider_unique;
ALTER TABLE ONLY auth.identities DROP CONSTRAINT identities_pkey;
ALTER TABLE ONLY auth.flow_state DROP CONSTRAINT flow_state_pkey;
ALTER TABLE ONLY auth.audit_log_entries DROP CONSTRAINT audit_log_entries_pkey;
ALTER TABLE ONLY auth.mfa_amr_claims DROP CONSTRAINT amr_id_pk;
ALTER TABLE public.usuario_rol ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.unidad ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.transicion_estado_cotizacion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.tipo_contacto ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.tipo_cliente ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.solicitud_cotizacion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.rubro ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.rol ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.proveedor ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.promocion_uso ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.promocion_descuento ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.promocion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.producto_proveedor ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.producto_precio_moneda ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.producto ALTER COLUMN sku DROP DEFAULT;
ALTER TABLE public.procesamiento_archivo_log ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.pedido_detalle ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.pedido ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.pais ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.pago_recibido ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.oportunidad ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.moneda ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.marca ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.inversion_categoria ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.historial_precios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.forma_pago ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.factura_detalle ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.factura ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.factoring_operacion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.estado_cotizacion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.empresa_emisora ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.disponibilidad ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.direccion_cliente ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.detalle_solicitud_cotizacion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.cuenta_por_cobrar ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.crowdlending_operacion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.crm_nota ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.crm_etapa ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.crm_actividad ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.cotizacion_detalle ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.cotizacion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.costos_operativos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.configuracion_fe ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.condiciones_comerciales ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.comunicacion_solicitud ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.cliente ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.ciudad ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.categoria ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.carrito_compra ALTER COLUMN id DROP DEFAULT;
ALTER TABLE auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
DROP TABLE storage.s3_multipart_uploads_parts;
DROP TABLE storage.s3_multipart_uploads;
DROP TABLE storage.prefixes;
DROP TABLE storage.objects;
DROP TABLE storage.migrations;
DROP TABLE storage.buckets_analytics;
DROP TABLE storage.buckets;
DROP TABLE realtime.subscription;
DROP TABLE realtime.schema_migrations;
DROP TABLE realtime.messages_2025_09_28;
DROP TABLE realtime.messages_2025_09_27;
DROP TABLE realtime.messages_2025_09_26;
DROP TABLE realtime.messages_2025_09_25;
DROP TABLE realtime.messages_2025_09_24;
DROP TABLE realtime.messages_2025_09_23;
DROP TABLE realtime.messages_2025_09_22;
DROP TABLE realtime.messages;
DROP VIEW public.v_transiciones_por_estado;
DROP VIEW public.v_solicitudes_pendientes;
DROP VIEW public.v_producto_compatibilidad;
DROP VIEW public.v_pipeline_crm;
DROP VIEW public.v_performance_asesores_embudo;
DROP VIEW public.v_historial_precios_detallado;
DROP VIEW public.v_cobranza_pendiente;
DROP VIEW public.v_ciclo_vida_cotizaciones;
DROP VIEW public.v_analisis_precios_calculados;
DROP VIEW public.v_analisis_perdidas;
DROP SEQUENCE public.usuario_rol_id_seq;
DROP TABLE public.usuario_rol;
DROP TABLE public.usuario;
DROP SEQUENCE public.unidad_id_seq;
DROP TABLE public.unidad;
DROP SEQUENCE public.transicion_estado_cotizacion_id_seq;
DROP TABLE public.transicion_estado_cotizacion;
DROP SEQUENCE public.tipo_contacto_id_seq;
DROP TABLE public.tipo_contacto;
DROP SEQUENCE public.tipo_cliente_id_seq1;
DROP SEQUENCE public.tipo_cliente_id_seq;
DROP TABLE public.tipo_cliente;
DROP SEQUENCE public.solicitud_cotizacion_id_seq;
DROP TABLE public.solicitud_cotizacion;
DROP TABLE public.solicitud_archivo;
DROP SEQUENCE public.rubro_id_seq;
DROP TABLE public.rubro;
DROP SEQUENCE public.rol_id_seq;
DROP TABLE public.rol;
DROP TABLE public.proveedor_marca;
DROP SEQUENCE public.proveedor_id_seq;
DROP TABLE public.proveedor_categoria;
DROP TABLE public.proveedor;
DROP SEQUENCE public.promocion_uso_id_seq;
DROP TABLE public.promocion_uso;
DROP SEQUENCE public.promocion_id_seq;
DROP SEQUENCE public.promocion_descuento_id_seq;
DROP TABLE public.promocion_descuento;
DROP TABLE public.promocion;
DROP SEQUENCE public.producto_sku_seq;
DROP SEQUENCE public.producto_proveedor_id_seq;
DROP TABLE public.producto_proveedor;
DROP SEQUENCE public.producto_precio_moneda_id_seq;
DROP TABLE public.producto_precio_moneda;
DROP TABLE public.producto;
DROP SEQUENCE public.procesamiento_archivo_log_id_seq;
DROP TABLE public.procesamiento_archivo_log;
DROP SEQUENCE public.pedido_id_seq;
DROP SEQUENCE public.pedido_detalle_id_seq;
DROP TABLE public.pedido_detalle;
DROP TABLE public.pedido;
DROP SEQUENCE public.pais_id_seq;
DROP TABLE public.pais;
DROP SEQUENCE public.pago_recibido_id_seq;
DROP TABLE public.pago_recibido;
DROP SEQUENCE public.oportunidad_id_seq;
DROP TABLE public.oportunidad;
DROP SEQUENCE public.moneda_id_seq;
DROP TABLE public.moneda;
DROP SEQUENCE public.marca_id_seq;
DROP TABLE public.marca_categoria;
DROP TABLE public.marca;
DROP SEQUENCE public.inversion_categoria_id_seq;
DROP TABLE public.inversion_categoria;
DROP SEQUENCE public.historial_precios_id_seq;
DROP TABLE public.historial_precios;
DROP SEQUENCE public.forma_pago_id_seq;
DROP TABLE public.forma_pago;
DROP SEQUENCE public.factura_id_seq;
DROP SEQUENCE public.factura_detalle_id_seq;
DROP TABLE public.factura_detalle;
DROP TABLE public.factura;
DROP SEQUENCE public.factoring_operacion_id_seq;
DROP TABLE public.factoring_operacion;
DROP SEQUENCE public.estado_cotizacion_id_seq;
DROP TABLE public.estado_cotizacion;
DROP SEQUENCE public.empresa_emisora_id_seq;
DROP TABLE public.empresa_emisora;
DROP TABLE public.distrito;
DROP SEQUENCE public.disponibilidad_id_seq;
DROP TABLE public.disponibilidad;
DROP SEQUENCE public.direccion_cliente_id_seq;
DROP TABLE public.direccion_cliente;
DROP SEQUENCE public.detalle_solicitud_cotizacion_id_seq;
DROP TABLE public.detalle_solicitud_cotizacion;
DROP SEQUENCE public.cuenta_por_cobrar_id_seq;
DROP TABLE public.cuenta_por_cobrar;
DROP SEQUENCE public.crowdlending_operacion_id_seq;
DROP TABLE public.crowdlending_operacion;
DROP SEQUENCE public.crm_nota_id_seq;
DROP TABLE public.crm_nota;
DROP SEQUENCE public.crm_etapa_id_seq;
DROP TABLE public.crm_etapa;
DROP SEQUENCE public.crm_actividad_id_seq;
DROP TABLE public.crm_actividad;
DROP SEQUENCE public.cotizacion_id_seq;
DROP SEQUENCE public.cotizacion_detalle_id_seq;
DROP TABLE public.cotizacion_detalle;
DROP TABLE public.cotizacion;
DROP SEQUENCE public.costos_operativos_id_seq;
DROP TABLE public.costos_operativos;
DROP TABLE public.configuracion_sistema;
DROP SEQUENCE public.configuracion_fe_id_seq;
DROP TABLE public.configuracion_fe;
DROP TABLE public.configuracion_archivos;
DROP SEQUENCE public.condiciones_comerciales_id_seq;
DROP TABLE public.condiciones_comerciales;
DROP SEQUENCE public.comunicacion_solicitud_id_seq;
DROP TABLE public.comunicacion_solicitud;
DROP VIEW public.collector_details;
DROP TABLE public.vehicle_types;
DROP TABLE public.recogedores;
DROP SEQUENCE public.cliente_id_seq;
DROP TABLE public.cliente;
DROP SEQUENCE public.ciudad_id_seq;
DROP TABLE public.ciudad;
DROP SEQUENCE public.categoria_id_seq;
DROP TABLE public.categoria;
DROP SEQUENCE public.carrito_compra_id_seq;
DROP TABLE public.carrito_compra;
DROP TABLE auth.users;
DROP TABLE auth.sso_providers;
DROP TABLE auth.sso_domains;
DROP TABLE auth.sessions;
DROP TABLE auth.schema_migrations;
DROP TABLE auth.saml_relay_states;
DROP TABLE auth.saml_providers;
DROP SEQUENCE auth.refresh_tokens_id_seq;
DROP TABLE auth.refresh_tokens;
DROP TABLE auth.one_time_tokens;
DROP TABLE auth.oauth_clients;
DROP TABLE auth.mfa_factors;
DROP TABLE auth.mfa_challenges;
DROP TABLE auth.mfa_amr_claims;
DROP TABLE auth.instances;
DROP TABLE auth.identities;
DROP TABLE auth.flow_state;
DROP TABLE auth.audit_log_entries;
DROP FUNCTION storage.update_updated_at_column();
DROP FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text);
DROP FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION storage.prefixes_insert_trigger();
DROP FUNCTION storage.prefixes_delete_cleanup();
DROP FUNCTION storage.operation();
DROP FUNCTION storage.objects_update_prefix_trigger();
DROP FUNCTION storage.objects_update_cleanup();
DROP FUNCTION storage.objects_insert_prefix_trigger();
DROP FUNCTION storage.objects_delete_cleanup();
DROP FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]);
DROP FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text);
DROP FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
DROP FUNCTION storage.get_size_by_bucket();
DROP FUNCTION storage.get_prefixes(name text);
DROP FUNCTION storage.get_prefix(name text);
DROP FUNCTION storage.get_level(name text);
DROP FUNCTION storage.foldername(name text);
DROP FUNCTION storage.filename(name text);
DROP FUNCTION storage.extension(name text);
DROP FUNCTION storage.enforce_bucket_name_length();
DROP FUNCTION storage.delete_prefix_hierarchy_trigger();
DROP FUNCTION storage.delete_prefix(_bucket_id text, _name text);
DROP FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]);
DROP FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
DROP FUNCTION storage.add_prefixes(_bucket_id text, _name text);
DROP FUNCTION realtime.topic();
DROP FUNCTION realtime.to_regrole(role_name text);
DROP FUNCTION realtime.subscription_check_filters();
DROP FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean);
DROP FUNCTION realtime.quote_wal2json(entity regclass);
DROP FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
DROP FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
DROP FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
DROP FUNCTION realtime."cast"(val text, type_ regtype);
DROP FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
DROP FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
DROP FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer);
DROP FUNCTION public.validar_margen_producto();
DROP FUNCTION public.update_updated_at_column();
DROP FUNCTION public.recalcular_precios_masivo(p_filtro_categoria bigint, p_filtro_proveedor bigint, p_nuevo_tipo_cambio numeric, p_usuario_id bigint);
DROP FUNCTION public.obtener_tasa_conversion(estado_origen_codigo character varying, estado_destino_codigo character varying, fecha_desde date);
DROP FUNCTION public.obtener_precio_producto(p_sku bigint, p_id_moneda bigint);
DROP FUNCTION public.get_precio_principal(p_sku bigint);
DROP FUNCTION public.get_margen_principal(p_sku bigint);
DROP FUNCTION public.get_auth_info();
DROP FUNCTION public.generar_codigo_solicitud();
DROP FUNCTION public.fn_registrar_transicion_estado_cotizacion();
DROP FUNCTION public.fn_registrar_primera_transicion();
DROP FUNCTION public.establecer_precio_producto(p_sku bigint, p_id_moneda bigint, p_precio_venta numeric, p_margen_aplicado numeric, p_usuario_id bigint);
DROP FUNCTION public.cotizaciones_en_riesgo();
DROP FUNCTION public.calcular_precio_venta_automatico();
DROP FUNCTION public.calcular_precio_multimoneda_automatico();
DROP FUNCTION public.calcular_dias_vencimiento();
DROP FUNCTION public.auto_generar_numero_factura();
DROP FUNCTION public.asociar_marca_categoria(p_id_marca bigint, p_id_categoria bigint);
DROP FUNCTION public.asegurar_principal_unico();
DROP FUNCTION public.actualizar_timestamp_cotizacion();
DROP FUNCTION public.actualizar_stock_pedido();
DROP FUNCTION public.actualizar_fecha_modificacion();
DROP FUNCTION public.actualizar_dias_pipeline();
DROP FUNCTION pgbouncer.get_auth(p_usename text);
DROP FUNCTION extensions.set_graphql_placeholder();
DROP FUNCTION extensions.pgrst_drop_watch();
DROP FUNCTION extensions.pgrst_ddl_watch();
DROP FUNCTION extensions.grant_pg_net_access();
DROP FUNCTION extensions.grant_pg_graphql_access();
DROP FUNCTION extensions.grant_pg_cron_access();
DROP FUNCTION auth.uid();
DROP FUNCTION auth.role();
DROP FUNCTION auth.jwt();
DROP FUNCTION auth.email();
DROP TYPE storage.buckettype;
DROP TYPE realtime.wal_rls;
DROP TYPE realtime.wal_column;
DROP TYPE realtime.user_defined_filter;
DROP TYPE realtime.equality_op;
DROP TYPE realtime.action;
DROP TYPE auth.one_time_token_type;
DROP TYPE auth.oauth_registration_type;
DROP TYPE auth.factor_type;
DROP TYPE auth.factor_status;
DROP TYPE auth.code_challenge_method;
DROP TYPE auth.aal_level;
DROP EXTENSION "uuid-ossp";
DROP EXTENSION supabase_vault;
DROP EXTENSION pgcrypto;
DROP EXTENSION pg_trgm;
DROP EXTENSION pg_stat_statements;
DROP EXTENSION pg_graphql;
DROP EXTENSION btree_gin;
DROP SCHEMA vault;
DROP SCHEMA storage;
DROP SCHEMA realtime;
-- *not* dropping schema, since initdb creates it
DROP SCHEMA pgbouncer;
DROP SCHEMA graphql_public;
DROP SCHEMA graphql;
DROP SCHEMA extensions;
DROP SCHEMA auth;
--
-- TOC entry 135 (class 2615 OID 16494)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- TOC entry 24 (class 2615 OID 16388)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- TOC entry 36 (class 2615 OID 16624)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- TOC entry 35 (class 2615 OID 16613)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- TOC entry 14 (class 2615 OID 16386)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- TOC entry 134 (class 2615 OID 19334)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5664 (class 0 OID 0)
-- Dependencies: 134
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 11 (class 2615 OID 16605)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- TOC entry 136 (class 2615 OID 16542)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- TOC entry 33 (class 2615 OID 16653)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- TOC entry 8 (class 3079 OID 55539)
-- Name: btree_gin; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA public;


--
-- TOC entry 5669 (class 0 OID 0)
-- Dependencies: 8
-- Name: EXTENSION btree_gin; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gin IS 'support for indexing common datatypes in GIN';


--
-- TOC entry 6 (class 3079 OID 16689)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- TOC entry 5670 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 5671 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 7 (class 3079 OID 55458)
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- TOC entry 5672 (class 0 OID 0)
-- Dependencies: 7
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- TOC entry 4 (class 3079 OID 16443)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 5673 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 5 (class 3079 OID 16654)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 5674 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 3 (class 3079 OID 16432)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 5675 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1446 (class 1247 OID 16782)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- TOC entry 1470 (class 1247 OID 16923)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- TOC entry 1443 (class 1247 OID 16776)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1440 (class 1247 OID 16771)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1702 (class 1247 OID 77031)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1476 (class 1247 OID 16965)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1491 (class 1247 OID 17136)
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- TOC entry 1502 (class 1247 OID 17093)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- TOC entry 1505 (class 1247 OID 17107)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- TOC entry 1497 (class 1247 OID 17179)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- TOC entry 1494 (class 1247 OID 17149)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- TOC entry 1696 (class 1247 OID 68460)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- TOC entry 615 (class 1255 OID 16540)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- TOC entry 5676 (class 0 OID 0)
-- Dependencies: 615
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 663 (class 1255 OID 16753)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- TOC entry 535 (class 1255 OID 16539)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- TOC entry 5679 (class 0 OID 0)
-- Dependencies: 535
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 568 (class 1255 OID 16538)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- TOC entry 5681 (class 0 OID 0)
-- Dependencies: 568
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 687 (class 1255 OID 16597)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- TOC entry 5697 (class 0 OID 0)
-- Dependencies: 687
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 654 (class 1255 OID 16618)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- TOC entry 5699 (class 0 OID 0)
-- Dependencies: 654
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 601 (class 1255 OID 16599)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- TOC entry 5701 (class 0 OID 0)
-- Dependencies: 601
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 521 (class 1255 OID 16609)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- TOC entry 718 (class 1255 OID 16610)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- TOC entry 547 (class 1255 OID 16620)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- TOC entry 5730 (class 0 OID 0)
-- Dependencies: 547
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 617 (class 1255 OID 16387)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- TOC entry 598 (class 1255 OID 19468)
-- Name: actualizar_dias_pipeline(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_dias_pipeline() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE oportunidad 
    SET dias_en_pipeline = EXTRACT(DAYS FROM (CURRENT_DATE - fecha_creacion::date))
    WHERE estado = 'ACTIVA';
END;
$$;


ALTER FUNCTION public.actualizar_dias_pipeline() OWNER TO postgres;

--
-- TOC entry 551 (class 1255 OID 21118)
-- Name: actualizar_fecha_modificacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_fecha_modificacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.actualizar_fecha_modificacion() OWNER TO postgres;

--
-- TOC entry 695 (class 1255 OID 21096)
-- Name: actualizar_stock_pedido(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_stock_pedido() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.estado = 'CONFIRMADO' AND OLD.estado = 'PENDIENTE' THEN
        -- Reservar stock
        UPDATE inventario 
        SET stock_reservado = stock_reservado + pd.cantidad,
            stock_disponible = stock_disponible - pd.cantidad
        FROM pedido_detalle pd
        WHERE pd.id_pedido = NEW.id AND inventario.sku = pd.sku;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.actualizar_stock_pedido() OWNER TO postgres;

--
-- TOC entry 577 (class 1255 OID 21119)
-- Name: actualizar_timestamp_cotizacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_timestamp_cotizacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.fecha_ultima_modificacion = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.actualizar_timestamp_cotizacion() OWNER TO postgres;

--
-- TOC entry 733 (class 1255 OID 21120)
-- Name: asegurar_principal_unico(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.asegurar_principal_unico() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.es_principal = true THEN
        -- Para documentos de identidad
        IF TG_TABLE_NAME = 'documento_identidad' THEN
            UPDATE documento_identidad 
            SET es_principal = false 
            WHERE entidad_tipo = NEW.entidad_tipo 
            AND entidad_id = NEW.entidad_id 
            AND id != COALESCE(NEW.id, -1)
            AND es_principal = true;
        END IF;
        
        -- Para teléfonos  
        IF TG_TABLE_NAME = 'telefono' THEN
            UPDATE telefono 
            SET es_principal = false 
            WHERE entidad_tipo = NEW.entidad_tipo 
            AND entidad_id = NEW.entidad_id 
            AND id != COALESCE(NEW.id, -1)
            AND es_principal = true;
        END IF;
        
        -- Para direcciones
        IF TG_TABLE_NAME = 'direccion' THEN
            UPDATE direccion 
            SET es_principal = false 
            WHERE entidad_tipo = NEW.entidad_tipo 
            AND entidad_id = NEW.entidad_id 
            AND id != COALESCE(NEW.id, -1)
            AND es_principal = true;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.asegurar_principal_unico() OWNER TO postgres;

--
-- TOC entry 697 (class 1255 OID 21121)
-- Name: asociar_marca_categoria(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.asociar_marca_categoria(p_id_marca bigint, p_id_categoria bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO marca_categoria (id_marca, id_categoria)
    VALUES (p_id_marca, p_id_categoria)
    ON CONFLICT (id_marca, id_categoria) DO NOTHING;
END;
$$;


ALTER FUNCTION public.asociar_marca_categoria(p_id_marca bigint, p_id_categoria bigint) OWNER TO postgres;

--
-- TOC entry 629 (class 1255 OID 21122)
-- Name: auto_generar_numero_factura(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_generar_numero_factura() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.numero IS NULL OR NEW.numero = '' THEN
        NEW.correlativo := (
            SELECT COALESCE(MAX(correlativo), 0) + 1
            FROM factura
            WHERE serie = NEW.serie 
            AND EXTRACT(YEAR FROM fecha_emision) = EXTRACT(YEAR FROM NEW.fecha_emision)
        );
        NEW.numero := NEW.serie || '-' || LPAD(NEW.correlativo::TEXT, 8, '0');
    END IF;
    NEW.saldo_pendiente := NEW.total - COALESCE(NEW.monto_pagado, 0);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.auto_generar_numero_factura() OWNER TO postgres;

--
-- TOC entry 741 (class 1255 OID 66326)
-- Name: calcular_dias_vencimiento(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calcular_dias_vencimiento() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.dias_vencimiento = NEW.fecha_vencimiento - CURRENT_DATE;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calcular_dias_vencimiento() OWNER TO postgres;

--
-- TOC entry 649 (class 1255 OID 106323)
-- Name: calcular_precio_multimoneda_automatico(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calcular_precio_multimoneda_automatico() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    costo_convertido NUMERIC(12,2);
    nuevo_precio_venta NUMERIC(12,2);
    margen_base NUMERIC(5,2) := COALESCE(NEW.margen_aplicado, 20.00);
BEGIN
    IF NEW.costo_proveedor IS NOT NULL AND NEW.costo_proveedor > 0 THEN
        costo_convertido := NEW.costo_proveedor * COALESCE(NEW.ultimo_tipo_cambio, 1);
        nuevo_precio_venta := ROUND(costo_convertido / (1 - (margen_base / 100.0)), 2);
        
        PERFORM establecer_precio_producto(
            NEW.sku, 
            1,
            nuevo_precio_venta, 
            margen_base,
            COALESCE(NEW.actualizado_por, NEW.creado_por)
        );
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calcular_precio_multimoneda_automatico() OWNER TO postgres;

--
-- TOC entry 613 (class 1255 OID 78218)
-- Name: calcular_precio_venta_automatico(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calcular_precio_venta_automatico() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    costo_convertido NUMERIC(12,2);
    margen_decimal NUMERIC(8,4);
    nuevo_precio_venta NUMERIC(12,2);
    precio_anterior NUMERIC(12,2);
BEGIN
    -- Solo calcular si tenemos los datos mínimos necesarios
    IF NEW.costo_proveedor IS NOT NULL 
       AND NEW.margen_aplicado IS NOT NULL 
       AND NEW.margen_aplicado > 0 
       AND NEW.margen_aplicado < 100 THEN
        
        -- Guardar precio anterior para historial
        precio_anterior := COALESCE(OLD.precio_venta, 0);
        
        -- Convertir costo a moneda base usando tipo de cambio
        costo_convertido := NEW.costo_proveedor * COALESCE(NEW.ultimo_tipo_cambio, 1);
        
        -- Convertir margen a decimal (20.00 -> 0.20)
        margen_decimal := NEW.margen_aplicado / 100.0;
        
        -- APLICAR FÓRMULA: PV = Costo / (1 - margen)
        nuevo_precio_venta := ROUND(costo_convertido / (1 - margen_decimal), 2);
        
        -- Asignar el precio calculado
        NEW.precio_venta := nuevo_precio_venta;
        
        -- Actualizar fecha de modificación
        NEW.fecha_actualizacion := NOW();
        
        -- Registrar en historial SOLO si el precio cambió
        IF precio_anterior IS NULL OR ABS(precio_anterior - nuevo_precio_venta) > 0.01 THEN
            INSERT INTO historial_precios (
                sku,
                tipo_precio,
                precio_anterior,
                precio_nuevo,
                motivo_cambio,
                id_usuario,
                contexto_evento,
                factor_aplicado,
                fecha_cambio,
                fecha_efectiva,
                aplicado
            ) VALUES (
                NEW.sku,
                'PRECIO_VENTA',
                precio_anterior,
                nuevo_precio_venta,
                CASE 
                    WHEN OLD IS NULL THEN 'CREACION_PRODUCTO'
                    WHEN OLD.costo_proveedor IS NULL OR ABS(OLD.costo_proveedor - NEW.costo_proveedor) > 0.01 THEN 'CAMBIO_COSTO_PROVEEDOR'
                    WHEN OLD.margen_aplicado IS NULL OR ABS(OLD.margen_aplicado - NEW.margen_aplicado) > 0.01 THEN 'CAMBIO_MARGEN'
                    WHEN OLD.ultimo_tipo_cambio IS NULL OR ABS(OLD.ultimo_tipo_cambio - NEW.ultimo_tipo_cambio) > 0.0001 THEN 'CAMBIO_TIPO_CAMBIO'
                    ELSE 'RECALCULO_AUTOMATICO'
                END,
                COALESCE(NEW.actualizado_por, NEW.creado_por, 1), -- Usuario sistema por defecto
                'CALCULO_AUTOMATICO',
                margen_decimal,
                NOW(),
                CURRENT_DATE,
                true
            );
        END IF;
        
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log del error pero no fallar la operación
        RAISE WARNING 'Error calculando precio_venta para SKU %: %', NEW.sku, SQLERRM;
        RETURN NEW;
END;
$$;


ALTER FUNCTION public.calcular_precio_venta_automatico() OWNER TO postgres;

--
-- TOC entry 538 (class 1255 OID 90408)
-- Name: cotizaciones_en_riesgo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cotizaciones_en_riesgo() RETURNS TABLE(numero_cotizacion character varying, cliente_nombre character varying, estado_actual character varying, dias_sin_movimiento integer, valor_soles numeric, riesgo_nivel character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH promedios_perdida AS (
        SELECT 
            t.estado_anterior_id,
            AVG(t.dias_en_estado_anterior) as dias_promedio_perdida
        FROM transicion_estado_cotizacion t
        JOIN estado_cotizacion ec ON t.estado_nuevo_id = ec.id
        WHERE ec.codigo = 'PERDIDO'
        GROUP BY t.estado_anterior_id
    )
    SELECT 
        c.numero,
        cl.razon_social,
        ec.nombre,
        EXTRACT(days FROM NOW() - c.fecha_actualizacion)::INTEGER,
        c.total_soles,
        CASE 
            WHEN EXTRACT(days FROM NOW() - c.fecha_actualizacion) >= pp.dias_promedio_perdida THEN 'ALTO'
            WHEN EXTRACT(days FROM NOW() - c.fecha_actualizacion) >= (pp.dias_promedio_perdida * 0.8) THEN 'MEDIO'
            ELSE 'BAJO'
        END
    FROM cotizacion c
    JOIN cliente cl ON c.id_cliente = cl.id
    JOIN estado_cotizacion ec ON c.id_estado = ec.id
    LEFT JOIN promedios_perdida pp ON pp.estado_anterior_id = ec.id
    WHERE c.activo = true
    AND ec.es_estado_final = false
    AND pp.dias_promedio_perdida IS NOT NULL
    AND EXTRACT(days FROM NOW() - c.fecha_actualizacion) >= (pp.dias_promedio_perdida * 0.7)
    ORDER BY 
        CASE 
            WHEN EXTRACT(days FROM NOW() - c.fecha_actualizacion) >= pp.dias_promedio_perdida THEN 1
            WHEN EXTRACT(days FROM NOW() - c.fecha_actualizacion) >= (pp.dias_promedio_perdida * 0.8) THEN 2
            ELSE 3
        END,
        c.total_soles DESC;
END;
$$;


ALTER FUNCTION public.cotizaciones_en_riesgo() OWNER TO postgres;

--
-- TOC entry 645 (class 1255 OID 106317)
-- Name: establecer_precio_producto(bigint, bigint, numeric, numeric, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.establecer_precio_producto(p_sku bigint, p_id_moneda bigint, p_precio_venta numeric, p_margen_aplicado numeric DEFAULT NULL::numeric, p_usuario_id bigint DEFAULT NULL::bigint) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE producto_precio_moneda 
    SET activo = FALSE, 
        fecha_actualizacion = NOW(),
        actualizado_por = p_usuario_id
    WHERE sku = p_sku AND id_moneda = p_id_moneda AND activo = TRUE;
    
    INSERT INTO producto_precio_moneda (
        sku, id_moneda, precio_venta, margen_aplicado, 
        creado_por, fecha_vigencia_desde, activo
    ) VALUES (
        p_sku, p_id_moneda, p_precio_venta, p_margen_aplicado,
        p_usuario_id, CURRENT_DATE, TRUE
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;


ALTER FUNCTION public.establecer_precio_producto(p_sku bigint, p_id_moneda bigint, p_precio_venta numeric, p_margen_aplicado numeric, p_usuario_id bigint) OWNER TO postgres;

--
-- TOC entry 722 (class 1255 OID 90385)
-- Name: fn_registrar_primera_transicion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_registrar_primera_transicion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Registrar estado inicial cuando se crea una cotización
    INSERT INTO transicion_estado_cotizacion (
        id_cotizacion,
        estado_anterior_id,
        estado_nuevo_id,
        fecha_transicion,
        usuario_responsable,
        dias_en_estado_anterior,
        automatico,
        valor_estimado,
        valor_cotizacion_momento,
        observaciones
    ) VALUES (
        NEW.id,
        NULL, -- No hay estado anterior en la creación
        NEW.id_estado,
        NEW.fecha_creacion,
        COALESCE(NEW.creado_por, NEW.id_asesor_ventas),
        0,
        true,
        NEW.total_soles,
        NEW.total_soles,
        'Estado inicial de la cotización'
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error en trigger primera transición: %', SQLERRM;
        RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_registrar_primera_transicion() OWNER TO postgres;

--
-- TOC entry 699 (class 1255 OID 90383)
-- Name: fn_registrar_transicion_estado_cotizacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_registrar_transicion_estado_cotizacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    dias_anteriores INTEGER := 0;
    usuario_actual BIGINT;
    valor_cotizacion NUMERIC(12,2);
    margen_actual NUMERIC(5,2);
BEGIN
    -- Solo procesar si realmente cambió el estado
    IF OLD.id_estado IS NOT DISTINCT FROM NEW.id_estado THEN
        RETURN NEW;
    END IF;
    
    -- Calcular días en estado anterior
    SELECT COALESCE(
        EXTRACT(days FROM NOW() - MAX(t.fecha_transicion)), 
        EXTRACT(days FROM NOW() - OLD.fecha_creacion)
    ) INTO dias_anteriores
    FROM transicion_estado_cotizacion t
    WHERE t.id_cotizacion = NEW.id;
    
    -- Obtener usuario responsable (prioridad: creado_por, asesor_ventas)
    usuario_actual := COALESCE(NEW.creado_por, NEW.id_asesor_ventas);
    
    -- Obtener valor y margen de la cotización
    valor_cotizacion := NEW.total_soles;
    margen_actual := NEW.porcentaje_margen_promedio;
    
    -- Insertar registro de transición
    INSERT INTO transicion_estado_cotizacion (
        id_cotizacion,
        estado_anterior_id,
        estado_nuevo_id,
        fecha_transicion,
        usuario_responsable,
        dias_en_estado_anterior,
        automatico,
        valor_estimado,
        valor_cotizacion_momento,
        margen_estimado,
        observaciones
    ) VALUES (
        NEW.id,
        OLD.id_estado,
        NEW.id_estado,
        NOW(),
        usuario_actual,
        dias_anteriores,
        true, -- Marcado como automático por trigger
        valor_cotizacion,
        valor_cotizacion,
        margen_actual,
        'Transición automática registrada por trigger del sistema'
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log el error pero no fallar la transacción principal
        RAISE WARNING 'Error en trigger transición estado: %', SQLERRM;
        RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_registrar_transicion_estado_cotizacion() OWNER TO postgres;

--
-- TOC entry 727 (class 1255 OID 66327)
-- Name: generar_codigo_solicitud(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generar_codigo_solicitud() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.codigo IS NULL OR NEW.codigo = '' THEN
        NEW.codigo := 'SOL-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || 
                     LPAD(NEW.id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.generar_codigo_solicitud() OWNER TO postgres;

--
-- TOC entry 658 (class 1255 OID 69036)
-- Name: get_auth_info(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_auth_info() RETURNS json
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT json_build_object(
    'uid', auth.uid(),
    'role', auth.role(),
    'jwt_claims', auth.jwt(),
    'session_user', session_user,
    'current_user', current_user,
    'current_timestamp', current_timestamp
  );
$$;


ALTER FUNCTION public.get_auth_info() OWNER TO postgres;

--
-- TOC entry 581 (class 1255 OID 106316)
-- Name: get_margen_principal(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_margen_principal(p_sku bigint) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    margen NUMERIC(5,2);
BEGIN
    SELECT margen_aplicado INTO margen
    FROM producto_precio_moneda 
    WHERE sku = p_sku 
    AND id_moneda = 1
    AND activo = TRUE
    ORDER BY fecha_vigencia_desde DESC
    LIMIT 1;
    
    RETURN COALESCE(margen, 0);
END;
$$;


ALTER FUNCTION public.get_margen_principal(p_sku bigint) OWNER TO postgres;

--
-- TOC entry 630 (class 1255 OID 106315)
-- Name: get_precio_principal(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_precio_principal(p_sku bigint) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN obtener_precio_producto(p_sku, 1);
END;
$$;


ALTER FUNCTION public.get_precio_principal(p_sku bigint) OWNER TO postgres;

--
-- TOC entry 731 (class 1255 OID 106314)
-- Name: obtener_precio_producto(bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtener_precio_producto(p_sku bigint, p_id_moneda bigint) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    precio NUMERIC(12,2);
BEGIN
    SELECT precio_venta INTO precio 
    FROM producto_precio_moneda 
    WHERE sku = p_sku 
    AND id_moneda = p_id_moneda 
    AND activo = TRUE
    AND (fecha_vigencia_hasta IS NULL OR fecha_vigencia_hasta >= CURRENT_DATE)
    ORDER BY fecha_vigencia_desde DESC
    LIMIT 1;
    
    RETURN COALESCE(precio, 0);
END;
$$;


ALTER FUNCTION public.obtener_precio_producto(p_sku bigint, p_id_moneda bigint) OWNER TO postgres;

--
-- TOC entry 626 (class 1255 OID 90407)
-- Name: obtener_tasa_conversion(character varying, character varying, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtener_tasa_conversion(estado_origen_codigo character varying, estado_destino_codigo character varying, fecha_desde date DEFAULT (now() - '3 mons'::interval)) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_origen INTEGER;
    total_destino INTEGER;
    tasa NUMERIC;
BEGIN
    -- Contar cotizaciones que pasaron por el estado origen
    SELECT COUNT(DISTINCT id_cotizacion) INTO total_origen
    FROM transicion_estado_cotizacion t
    JOIN estado_cotizacion ec ON t.estado_nuevo_id = ec.id
    WHERE ec.codigo = estado_origen_codigo
    AND t.fecha_transicion >= fecha_desde;
    
    -- Contar cuántas de esas llegaron al estado destino
    SELECT COUNT(DISTINCT t1.id_cotizacion) INTO total_destino
    FROM transicion_estado_cotizacion t1
    JOIN estado_cotizacion ec1 ON t1.estado_nuevo_id = ec1.id
    WHERE ec1.codigo = estado_origen_codigo
    AND t1.fecha_transicion >= fecha_desde
    AND EXISTS (
        SELECT 1 FROM transicion_estado_cotizacion t2
        JOIN estado_cotizacion ec2 ON t2.estado_nuevo_id = ec2.id
        WHERE t2.id_cotizacion = t1.id_cotizacion
        AND ec2.codigo = estado_destino_codigo
        AND t2.fecha_transicion > t1.fecha_transicion
    );
    
    -- Calcular tasa
    IF total_origen > 0 THEN
        tasa := (total_destino * 100.0) / total_origen;
    ELSE
        tasa := 0;
    END IF;
    
    RETURN ROUND(tasa, 2);
END;
$$;


ALTER FUNCTION public.obtener_tasa_conversion(estado_origen_codigo character varying, estado_destino_codigo character varying, fecha_desde date) OWNER TO postgres;

--
-- TOC entry 619 (class 1255 OID 78220)
-- Name: recalcular_precios_masivo(bigint, bigint, numeric, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.recalcular_precios_masivo(p_filtro_categoria bigint DEFAULT NULL::bigint, p_filtro_proveedor bigint DEFAULT NULL::bigint, p_nuevo_tipo_cambio numeric DEFAULT NULL::numeric, p_usuario_id bigint DEFAULT 1) RETURNS TABLE(productos_procesados integer, productos_actualizados integer, errores integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_procesados INTEGER := 0;
    total_actualizados INTEGER := 0;
    total_errores INTEGER := 0;
    record_producto RECORD;
BEGIN
    -- Iterar sobre productos que cumplan los filtros
    FOR record_producto IN 
        SELECT sku, costo_proveedor, margen_aplicado, ultimo_tipo_cambio, precio_venta
        FROM producto 
        WHERE activo = true
          AND costo_proveedor IS NOT NULL 
          AND margen_aplicado IS NOT NULL
          AND (p_filtro_categoria IS NULL OR id_categoria = p_filtro_categoria)
          AND (p_filtro_proveedor IS NULL OR id_proveedor_principal = p_filtro_proveedor)
    LOOP
        BEGIN
            total_procesados := total_procesados + 1;
            
            -- Actualizar tipo de cambio si se proporciona
            IF p_nuevo_tipo_cambio IS NOT NULL THEN
                UPDATE producto 
                SET ultimo_tipo_cambio = p_nuevo_tipo_cambio,
                    actualizado_por = p_usuario_id
                WHERE sku = record_producto.sku;
                
                total_actualizados := total_actualizados + 1;
            ELSE
                -- Solo forzar recálculo
                UPDATE producto 
                SET fecha_actualizacion = NOW(),
                    actualizado_por = p_usuario_id
                WHERE sku = record_producto.sku;
                
                total_actualizados := total_actualizados + 1;
            END IF;
            
        EXCEPTION
            WHEN OTHERS THEN
                total_errores := total_errores + 1;
                RAISE WARNING 'Error procesando SKU %: %', record_producto.sku, SQLERRM;
        END;
    END LOOP;
    
    productos_procesados := total_procesados;
    productos_actualizados := total_actualizados;
    errores := total_errores;
    
    RETURN NEXT;
END;
$$;


ALTER FUNCTION public.recalcular_precios_masivo(p_filtro_categoria bigint, p_filtro_proveedor bigint, p_nuevo_tipo_cambio numeric, p_usuario_id bigint) OWNER TO postgres;

--
-- TOC entry 659 (class 1255 OID 66325)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- TOC entry 760 (class 1255 OID 78221)
-- Name: validar_margen_producto(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_margen_producto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    margen_minimo_config NUMERIC(5,2);
BEGIN
    -- Obtener margen mínimo de configuración
    SELECT valor::NUMERIC INTO margen_minimo_config 
    FROM configuracion_sistema 
    WHERE clave = 'MARGEN_MINIMO' AND activo = true
    LIMIT 1;
    
    -- Si no hay configuración, usar 15% por defecto
    margen_minimo_config := COALESCE(margen_minimo_config, 15.00);
    
    -- Validar rango de margen
        IF NEW.margen_aplicado < margen_minimo_config THEN
            RAISE EXCEPTION 'Margen aplicado debe ser mayor o igual a %s%%', margen_minimo_config;
        END IF;
        
        IF NEW.margen_aplicado >= 100 THEN
            RAISE EXCEPTION 'Margen aplicado debe ser menor a 100%%';
        END IF;
        
        IF NEW.margen_aplicado > 80 THEN
            RAISE WARNING 'Margen aplicado muy alto (%s%%): verificar si es correcto', NEW.margen_aplicado;
        END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.validar_margen_producto() OWNER TO postgres;

--
-- TOC entry 518 (class 1255 OID 17172)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 767 (class 1255 OID 17252)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- TOC entry 618 (class 1255 OID 17184)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- TOC entry 735 (class 1255 OID 17133)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- TOC entry 564 (class 1255 OID 17128)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- TOC entry 579 (class 1255 OID 17180)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- TOC entry 560 (class 1255 OID 17192)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 769 (class 1255 OID 17127)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- TOC entry 573 (class 1255 OID 17251)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- TOC entry 714 (class 1255 OID 17125)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- TOC entry 533 (class 1255 OID 17161)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- TOC entry 685 (class 1255 OID 17245)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- TOC entry 677 (class 1255 OID 68438)
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 652 (class 1255 OID 17036)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- TOC entry 578 (class 1255 OID 102328)
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
            SELECT bucket_id,
                   name,
                   storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
            SELECT p.bucket_id, p.name, p.level
            FROM storage.prefixes AS p
            JOIN uniq AS u
              ON u.bucket_id = p.bucket_id
                  AND u.name = p.name
                  AND u.level = p.level
            WHERE NOT EXISTS (
                SELECT 1
                FROM storage.objects AS o
                WHERE o.bucket_id = p.bucket_id
                  AND storage.get_level(o.name) = p.level + 1
                  AND o.name COLLATE "C" LIKE p.name || '/%'
            )
            AND NOT EXISTS (
                SELECT 1
                FROM storage.prefixes AS c
                WHERE c.bucket_id = p.bucket_id
                  AND c.level = p.level + 1
                  AND c.name COLLATE "C" LIKE p.name || '/%'
            )
        )
        DELETE FROM storage.prefixes AS p
        USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- TOC entry 694 (class 1255 OID 68439)
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 635 (class 1255 OID 68442)
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 720 (class 1255 OID 68457)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- TOC entry 666 (class 1255 OID 17010)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 703 (class 1255 OID 17009)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 528 (class 1255 OID 17008)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 556 (class 1255 OID 68420)
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 539 (class 1255 OID 68436)
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 562 (class 1255 OID 68437)
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 729 (class 1255 OID 68455)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- TOC entry 648 (class 1255 OID 17075)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 690 (class 1255 OID 17038)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 585 (class 1255 OID 102327)
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- TOC entry 531 (class 1255 OID 102329)
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- TOC entry 667 (class 1255 OID 68441)
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 748 (class 1255 OID 102330)
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_update_cleanup() OWNER TO supabase_storage_admin;

--
-- TOC entry 614 (class 1255 OID 68456)
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 610 (class 1255 OID 17091)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- TOC entry 668 (class 1255 OID 102331)
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.prefixes_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- TOC entry 574 (class 1255 OID 68440)
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 540 (class 1255 OID 17025)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 715 (class 1255 OID 68453)
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 582 (class 1255 OID 68452)
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 559 (class 1255 OID 102326)
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- TOC entry 641 (class 1255 OID 17026)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 356 (class 1259 OID 16525)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- TOC entry 5782 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 373 (class 1259 OID 16927)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- TOC entry 5784 (class 0 OID 0)
-- Dependencies: 373
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- TOC entry 364 (class 1259 OID 16725)
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- TOC entry 5786 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 5787 (class 0 OID 0)
-- Dependencies: 364
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 355 (class 1259 OID 16518)
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- TOC entry 5789 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 368 (class 1259 OID 16814)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- TOC entry 5791 (class 0 OID 0)
-- Dependencies: 368
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 367 (class 1259 OID 16802)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 5793 (class 0 OID 0)
-- Dependencies: 367
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 366 (class 1259 OID 16789)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- TOC entry 5795 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 495 (class 1259 OID 77035)
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_id text NOT NULL,
    client_secret_hash text NOT NULL,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- TOC entry 374 (class 1259 OID 16977)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 354 (class 1259 OID 16507)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 5799 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 353 (class 1259 OID 16506)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- TOC entry 5801 (class 0 OID 0)
-- Dependencies: 353
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 371 (class 1259 OID 16856)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 5803 (class 0 OID 0)
-- Dependencies: 371
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 372 (class 1259 OID 16874)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- TOC entry 5805 (class 0 OID 0)
-- Dependencies: 372
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 357 (class 1259 OID 16533)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- TOC entry 5807 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 365 (class 1259 OID 16755)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- TOC entry 5808 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 5809 (class 0 OID 0)
-- Dependencies: 365
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 370 (class 1259 OID 16841)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- TOC entry 5811 (class 0 OID 0)
-- Dependencies: 370
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 369 (class 1259 OID 16832)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 5813 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 5814 (class 0 OID 0)
-- Dependencies: 369
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 352 (class 1259 OID 16495)
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- TOC entry 5816 (class 0 OID 0)
-- Dependencies: 352
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 5817 (class 0 OID 0)
-- Dependencies: 352
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 481 (class 1259 OID 67962)
-- Name: carrito_compra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrito_compra (
    id bigint NOT NULL,
    id_cliente bigint,
    session_id character varying(100),
    ip_address inet,
    user_agent text,
    dispositivo_info character varying(200),
    sku bigint NOT NULL,
    cantidad numeric(10,3) NOT NULL,
    precio_unitario numeric(12,2) NOT NULL,
    id_moneda_precio bigint,
    configuracion_especial text,
    notas_cliente character varying(500),
    id_promocion bigint,
    descuento_aplicado numeric(12,2) DEFAULT 0,
    fecha_agregado timestamp without time zone DEFAULT now(),
    fecha_ultima_modificacion timestamp without time zone DEFAULT now(),
    fecha_expiracion timestamp without time zone DEFAULT (now() + '30 days'::interval),
    CONSTRAINT cantidad_positiva_carrito CHECK ((cantidad > (0)::numeric))
);


ALTER TABLE public.carrito_compra OWNER TO postgres;

--
-- TOC entry 480 (class 1259 OID 67961)
-- Name: carrito_compra_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carrito_compra_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carrito_compra_id_seq OWNER TO postgres;

--
-- TOC entry 5822 (class 0 OID 0)
-- Dependencies: 480
-- Name: carrito_compra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carrito_compra_id_seq OWNED BY public.carrito_compra.id;


--
-- TOC entry 408 (class 1259 OID 66777)
-- Name: categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria (
    id bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(300),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categoria OWNER TO postgres;

--
-- TOC entry 407 (class 1259 OID 66776)
-- Name: categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_id_seq OWNER TO postgres;

--
-- TOC entry 5825 (class 0 OID 0)
-- Dependencies: 407
-- Name: categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;


--
-- TOC entry 390 (class 1259 OID 66653)
-- Name: ciudad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciudad (
    id bigint NOT NULL,
    codigo character varying(10) NOT NULL,
    nombre character varying(100) NOT NULL,
    id_pais bigint NOT NULL,
    codigo_postal character varying(20),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ciudad OWNER TO postgres;

--
-- TOC entry 389 (class 1259 OID 66652)
-- Name: ciudad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ciudad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ciudad_id_seq OWNER TO postgres;

--
-- TOC entry 5828 (class 0 OID 0)
-- Dependencies: 389
-- Name: ciudad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ciudad_id_seq OWNED BY public.ciudad.id;


--
-- TOC entry 419 (class 1259 OID 66864)
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id bigint NOT NULL,
    nombre character varying(60) NOT NULL,
    apellidos character varying(60) NOT NULL,
    correo character varying(100) NOT NULL,
    telefono character varying(25),
    contrasena character varying(255) NOT NULL,
    razon_social character varying(150),
    documento_personal character varying(25),
    documento_empresa character varying(25),
    id_rubro bigint NOT NULL,
    id_tipo_cliente bigint NOT NULL,
    id_pais bigint NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    verificado boolean DEFAULT false,
    fecha_registro timestamp without time zone DEFAULT now(),
    fecha_ultima_compra timestamp without time zone,
    id_tipo_contacto bigint DEFAULT 2
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- TOC entry 5830 (class 0 OID 0)
-- Dependencies: 419
-- Name: TABLE cliente; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.cliente IS 'Base de datos de clientes B2B (empresas y personas naturales)';


--
-- TOC entry 418 (class 1259 OID 66863)
-- Name: cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cliente_id_seq OWNER TO postgres;

--
-- TOC entry 5832 (class 0 OID 0)
-- Dependencies: 418
-- Name: cliente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliente_id_seq OWNED BY public.cliente.id;


--
-- TOC entry 425 (class 1259 OID 66947)
-- Name: recogedores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recogedores (
    id bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    apellidos character varying(100),
    correo character varying(100),
    telefono character varying(25),
    zona_preferida character varying(100),
    experiencia text,
    id_vehicle_type bigint,
    licencia_conducir character varying(20),
    fecha_vencimiento_licencia date,
    calificacion numeric(3,2) DEFAULT 5.0,
    activo boolean DEFAULT true NOT NULL,
    status character varying(20) DEFAULT 'activo'::character varying,
    ubicacion_actual jsonb,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT calificacion_valida_recogedores CHECK (((calificacion >= 1.0) AND (calificacion <= 5.0))),
    CONSTRAINT recogedores_status_check CHECK (((status)::text = ANY (ARRAY['activo'::text, 'inactivo'::text, 'en_proceso'::text])))
);


ALTER TABLE public.recogedores OWNER TO postgres;

--
-- TOC entry 412 (class 1259 OID 66799)
-- Name: vehicle_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_types (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    capacidad_carga_kg numeric(8,2),
    capacidad_volumen_m3 numeric(8,3),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehicle_types OWNER TO postgres;

--
-- TOC entry 488 (class 1259 OID 68098)
-- Name: collector_details; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.collector_details AS
 SELECT r.id,
    r.nombre,
    r.apellidos,
    r.correo,
    r.telefono,
    r.zona_preferida,
    r.experiencia,
    r.status,
    v.nombre AS vehiculo_tipo,
    v.descripcion AS vehiculo_descripcion
   FROM (public.recogedores r
     LEFT JOIN public.vehicle_types v ON ((r.id_vehicle_type = v.id)));


ALTER VIEW public.collector_details OWNER TO postgres;

--
-- TOC entry 448 (class 1259 OID 67323)
-- Name: comunicacion_solicitud; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comunicacion_solicitud (
    id bigint NOT NULL,
    id_solicitud_cotizacion bigint NOT NULL,
    tipo character varying(20) NOT NULL,
    direccion character varying(20) NOT NULL,
    asunto character varying(200),
    mensaje text,
    contacto_exitoso boolean DEFAULT true,
    respuesta_cliente boolean DEFAULT false,
    requiere_seguimiento boolean DEFAULT false,
    fecha_seguimiento date,
    id_usuario bigint,
    fecha_comunicacion timestamp without time zone DEFAULT now(),
    duracion_minutos integer
);


ALTER TABLE public.comunicacion_solicitud OWNER TO postgres;

--
-- TOC entry 447 (class 1259 OID 67322)
-- Name: comunicacion_solicitud_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comunicacion_solicitud_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comunicacion_solicitud_id_seq OWNER TO postgres;

--
-- TOC entry 5838 (class 0 OID 0)
-- Dependencies: 447
-- Name: comunicacion_solicitud_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comunicacion_solicitud_id_seq OWNED BY public.comunicacion_solicitud.id;


--
-- TOC entry 404 (class 1259 OID 66743)
-- Name: condiciones_comerciales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condiciones_comerciales (
    id bigint NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(300),
    terminos_generales text,
    terminos_entrega character varying(200),
    terminos_garantia character varying(200),
    detalle_entrega character varying(100),
    ofrece_credito boolean DEFAULT false NOT NULL,
    dias_credito smallint DEFAULT 0,
    condiciones_credito character varying(200),
    monto_min_pedido numeric(12,2),
    id_moneda_min_pedido bigint,
    descuento_volumen numeric(5,2) DEFAULT 0,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.condiciones_comerciales OWNER TO postgres;

--
-- TOC entry 403 (class 1259 OID 66742)
-- Name: condiciones_comerciales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.condiciones_comerciales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.condiciones_comerciales_id_seq OWNER TO postgres;

--
-- TOC entry 5841 (class 0 OID 0)
-- Dependencies: 403
-- Name: condiciones_comerciales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.condiciones_comerciales_id_seq OWNED BY public.condiciones_comerciales.id;


--
-- TOC entry 427 (class 1259 OID 66982)
-- Name: configuracion_archivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_archivos (
    clave character varying(100) NOT NULL,
    valor text NOT NULL,
    descripcion text,
    tipo_archivo character varying(50),
    tamano_maximo_mb numeric(8,2) DEFAULT 50.00,
    extensiones_permitidas text[],
    categoria character varying(30) DEFAULT 'GENERAL'::character varying,
    activo boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.configuracion_archivos OWNER TO postgres;

--
-- TOC entry 429 (class 1259 OID 66994)
-- Name: configuracion_fe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_fe (
    id bigint NOT NULL,
    id_pais bigint NOT NULL,
    ruc_empresa character varying(11) NOT NULL,
    razon_social_emisor character varying(150) NOT NULL,
    direccion_fiscal text NOT NULL,
    usuario_sol character varying(50),
    clave_sol character varying(100),
    modo_pruebas boolean DEFAULT true,
    serie_factura character varying(4) DEFAULT 'F001'::character varying,
    serie_boleta character varying(4) DEFAULT 'B001'::character varying,
    proveedor_fe character varying(50) NOT NULL,
    url_api character varying(300) NOT NULL,
    token_acceso character varying(500),
    certificado_digital text,
    password_certificado character varying(100),
    ambiente character varying(20) DEFAULT 'PRODUCCION'::character varying,
    activo boolean DEFAULT true,
    fecha_configuracion timestamp without time zone DEFAULT now(),
    configurado_por bigint
);


ALTER TABLE public.configuracion_fe OWNER TO postgres;

--
-- TOC entry 428 (class 1259 OID 66993)
-- Name: configuracion_fe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracion_fe_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_fe_id_seq OWNER TO postgres;

--
-- TOC entry 5845 (class 0 OID 0)
-- Dependencies: 428
-- Name: configuracion_fe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracion_fe_id_seq OWNED BY public.configuracion_fe.id;


--
-- TOC entry 426 (class 1259 OID 66968)
-- Name: configuracion_sistema; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_sistema (
    clave character varying(100) NOT NULL,
    valor text NOT NULL,
    descripcion text,
    tipo_dato character varying(20) DEFAULT 'STRING'::character varying,
    categoria character varying(50) DEFAULT 'GENERAL'::character varying,
    editable boolean DEFAULT true,
    iso_code_pais character varying(3),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now(),
    CONSTRAINT config_tipo_check CHECK (((tipo_dato)::text = ANY (ARRAY[('STRING'::character varying)::text, ('NUMBER'::character varying)::text, ('BOOLEAN'::character varying)::text, ('JSON'::character varying)::text])))
);


ALTER TABLE public.configuracion_sistema OWNER TO postgres;

--
-- TOC entry 485 (class 1259 OID 68036)
-- Name: costos_operativos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.costos_operativos (
    id bigint NOT NULL,
    "periodo_año" integer NOT NULL,
    periodo_mes integer NOT NULL,
    categoria_costo character varying(50) NOT NULL,
    subcategoria character varying(100),
    monto numeric(12,2) NOT NULL,
    id_moneda bigint NOT NULL,
    descripcion character varying(200),
    es_recurrente boolean DEFAULT true,
    centro_costo character varying(50),
    responsable bigint,
    fecha_identificacion date DEFAULT CURRENT_DATE,
    fecha_creacion timestamp without time zone DEFAULT now(),
    CONSTRAINT categoria_valida CHECK (((categoria_costo)::text = ANY (ARRAY[('MARKETING'::character varying)::text, ('OPERACIONAL'::character varying)::text, ('ADMINISTRATIVO'::character varying)::text, ('FINANCIERO'::character varying)::text, ('TECNOLOGICO'::character varying)::text]))),
    CONSTRAINT periodo_valido CHECK (((periodo_mes >= 1) AND (periodo_mes <= 12)))
);


ALTER TABLE public.costos_operativos OWNER TO postgres;

--
-- TOC entry 484 (class 1259 OID 68035)
-- Name: costos_operativos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.costos_operativos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.costos_operativos_id_seq OWNER TO postgres;

--
-- TOC entry 5849 (class 0 OID 0)
-- Dependencies: 484
-- Name: costos_operativos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.costos_operativos_id_seq OWNED BY public.costos_operativos.id;


--
-- TOC entry 461 (class 1259 OID 67527)
-- Name: cotizacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cotizacion (
    id bigint NOT NULL,
    numero character varying(20) NOT NULL,
    fecha_emision date DEFAULT CURRENT_DATE NOT NULL,
    fecha_vencimiento date,
    validez_dias smallint DEFAULT 15,
    validez_oferta_dias smallint DEFAULT 7,
    id_cliente bigint NOT NULL,
    atencion character varying(150),
    id_asesor_ventas bigint NOT NULL,
    tipo_cambio_usd_pen numeric(10,4) DEFAULT 3.75 NOT NULL,
    tipo_cambio_eur_pen numeric(10,4) DEFAULT 4.10,
    tipo_cambio_clp_pen numeric(10,4),
    fecha_tipo_cambio timestamp without time zone DEFAULT now() NOT NULL,
    lugar_entrega character varying(200),
    id_forma_pago bigint,
    id_condiciones_comerciales bigint,
    id_moneda_cotizacion bigint NOT NULL,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    subtotal_soles numeric(12,2) NOT NULL,
    descuento_total numeric(12,2) DEFAULT 0,
    igv numeric(12,2) DEFAULT 0 NOT NULL,
    igv_soles numeric(12,2) NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    total_soles numeric(12,2) NOT NULL,
    porcentaje_igv numeric(5,2) DEFAULT 18.00,
    costo_total_proveedores numeric(12,2),
    margen_bruto_total numeric(12,2),
    porcentaje_margen_promedio numeric(5,2),
    gastos_operativos numeric(12,2) DEFAULT 0,
    gastos_ventas numeric(12,2) DEFAULT 0,
    gastos_administrativos numeric(12,2) DEFAULT 0,
    gastos_financieros numeric(12,2) DEFAULT 0,
    utilidad_neta numeric(12,2),
    utilidad_operativa numeric(12,2),
    observaciones text,
    observaciones_internas text,
    activo boolean DEFAULT true NOT NULL,
    telefono_contacto character varying(25) DEFAULT '+51 963 381 909'::character varying,
    email_contacto character varying(100),
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now(),
    fecha_ultima_modificacion timestamp without time zone DEFAULT now(),
    creado_por bigint,
    id_estado integer DEFAULT 1,
    id_disponibilidad bigint
);


ALTER TABLE public.cotizacion OWNER TO postgres;

--
-- TOC entry 5851 (class 0 OID 0)
-- Dependencies: 461
-- Name: TABLE cotizacion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.cotizacion IS 'Cotizaciones generadas para clientes con análisis interno de márgenes';


--
-- TOC entry 5852 (class 0 OID 0)
-- Dependencies: 461
-- Name: COLUMN cotizacion.margen_bruto_total; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.cotizacion.margen_bruto_total IS 'Margen bruto calculado automáticamente (análisis interno)';


--
-- TOC entry 463 (class 1259 OID 67596)
-- Name: cotizacion_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cotizacion_detalle (
    id bigint NOT NULL,
    id_cotizacion bigint NOT NULL,
    item smallint NOT NULL,
    sku bigint NOT NULL,
    descripcion_personalizada text,
    cantidad numeric(10,3) NOT NULL,
    marca character varying(80),
    unidad character varying(10) DEFAULT 'UND.'::character varying,
    precio_unitario_original numeric(12,2) NOT NULL,
    precio_unitario_soles numeric(12,2) NOT NULL,
    moneda_original character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    precio_unitario_convertido numeric(12,2) NOT NULL,
    descuento_unitario numeric(12,2) DEFAULT 0,
    descuento_porcentaje numeric(5,2) DEFAULT 0,
    precio_unitario_final numeric(12,2) NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    precio_total_soles numeric(12,2) NOT NULL,
    id_proveedor_principal bigint,
    id_proveedor bigint,
    codigo_proveedor character varying(50),
    precio_costo_proveedor numeric(12,2),
    costo_unitario_proveedor numeric(12,2),
    id_moneda_costo_proveedor bigint,
    tipo_cambio_aplicado numeric(10,4),
    tiempo_entrega_dias smallint DEFAULT 0,
    tiempo_entrega_proveedor smallint,
    margen_unitario numeric(12,2),
    margen_total_linea numeric(12,2),
    porcentaje_margen numeric(5,2),
    notas_vendedor text,
    notas_internas text,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    CONSTRAINT cantidad_positiva CHECK ((cantidad > (0)::numeric))
);


ALTER TABLE public.cotizacion_detalle OWNER TO postgres;

--
-- TOC entry 462 (class 1259 OID 67595)
-- Name: cotizacion_detalle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cotizacion_detalle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cotizacion_detalle_id_seq OWNER TO postgres;

--
-- TOC entry 5855 (class 0 OID 0)
-- Dependencies: 462
-- Name: cotizacion_detalle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cotizacion_detalle_id_seq OWNED BY public.cotizacion_detalle.id;


--
-- TOC entry 460 (class 1259 OID 67526)
-- Name: cotizacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cotizacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cotizacion_id_seq OWNER TO postgres;

--
-- TOC entry 5857 (class 0 OID 0)
-- Dependencies: 460
-- Name: cotizacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cotizacion_id_seq OWNED BY public.cotizacion.id;


--
-- TOC entry 457 (class 1259 OID 67440)
-- Name: crm_actividad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_actividad (
    id bigint NOT NULL,
    tipo character varying(30) NOT NULL,
    subtipo character varying(50),
    asunto character varying(200),
    titulo character varying(200) NOT NULL,
    descripcion text,
    id_cliente bigint,
    id_oportunidad bigint,
    id_solicitud_cotizacion bigint,
    id_usuario bigint NOT NULL,
    id_usuario_responsable bigint,
    fecha_programada timestamp without time zone,
    fecha_realizada timestamp without time zone,
    fecha_completada timestamp without time zone,
    duracion_minutos integer DEFAULT 0,
    ubicacion character varying(200),
    estado character varying(20) DEFAULT 'PROGRAMADA'::character varying,
    resultado character varying(20),
    completada boolean DEFAULT false,
    prioridad character varying(10) DEFAULT 'MEDIA'::character varying,
    genera_seguimiento boolean DEFAULT false,
    requiere_seguimiento boolean DEFAULT false,
    fecha_seguimiento timestamp without time zone,
    observaciones_seguimiento text,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now(),
    creado_por bigint,
    CONSTRAINT estado_actividad_valido CHECK (((estado)::text = ANY (ARRAY[('PROGRAMADA'::character varying)::text, ('REALIZADA'::character varying)::text, ('CANCELADA'::character varying)::text, ('REPROGRAMADA'::character varying)::text]))),
    CONSTRAINT prioridad_valida CHECK (((prioridad)::text = ANY (ARRAY[('ALTA'::character varying)::text, ('MEDIA'::character varying)::text, ('BAJA'::character varying)::text]))),
    CONSTRAINT tipo_actividad_valido CHECK (((tipo)::text = ANY (ARRAY[('LLAMADA'::character varying)::text, ('EMAIL'::character varying)::text, ('REUNION'::character varying)::text, ('TAREA'::character varying)::text, ('NOTA'::character varying)::text, ('WHATSAPP'::character varying)::text, ('VISITA'::character varying)::text])))
);


ALTER TABLE public.crm_actividad OWNER TO postgres;

--
-- TOC entry 456 (class 1259 OID 67439)
-- Name: crm_actividad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crm_actividad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crm_actividad_id_seq OWNER TO postgres;

--
-- TOC entry 5860 (class 0 OID 0)
-- Dependencies: 456
-- Name: crm_actividad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crm_actividad_id_seq OWNED BY public.crm_actividad.id;


--
-- TOC entry 414 (class 1259 OID 66812)
-- Name: crm_etapa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_etapa (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(200),
    orden_secuencial smallint NOT NULL,
    probabilidad_cierre_default numeric(3,0) DEFAULT 10,
    color_hex character varying(7) DEFAULT '#6B7280'::character varying,
    es_etapa_final boolean DEFAULT false,
    es_exitosa boolean DEFAULT false,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.crm_etapa OWNER TO postgres;

--
-- TOC entry 413 (class 1259 OID 66811)
-- Name: crm_etapa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crm_etapa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crm_etapa_id_seq OWNER TO postgres;

--
-- TOC entry 5863 (class 0 OID 0)
-- Dependencies: 413
-- Name: crm_etapa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crm_etapa_id_seq OWNED BY public.crm_etapa.id;


--
-- TOC entry 459 (class 1259 OID 67490)
-- Name: crm_nota; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_nota (
    id bigint NOT NULL,
    titulo character varying(200),
    contenido text NOT NULL,
    tipo character varying(20) DEFAULT 'GENERAL'::character varying,
    id_cliente bigint,
    id_oportunidad bigint,
    id_actividad bigint,
    es_publica boolean DEFAULT true,
    etiquetas character varying(500),
    fecha_creacion timestamp without time zone DEFAULT now(),
    creado_por bigint,
    fecha_modificacion timestamp without time zone,
    modificado_por bigint
);


ALTER TABLE public.crm_nota OWNER TO postgres;

--
-- TOC entry 458 (class 1259 OID 67489)
-- Name: crm_nota_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crm_nota_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crm_nota_id_seq OWNER TO postgres;

--
-- TOC entry 5866 (class 0 OID 0)
-- Dependencies: 458
-- Name: crm_nota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crm_nota_id_seq OWNED BY public.crm_nota.id;


--
-- TOC entry 479 (class 1259 OID 67936)
-- Name: crowdlending_operacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crowdlending_operacion (
    id bigint NOT NULL,
    codigo_operacion character varying(20) NOT NULL,
    id_pedido bigint,
    id_cliente bigint NOT NULL,
    monto_financiado numeric(12,2) NOT NULL,
    tasa_interes_anual numeric(5,2) NOT NULL,
    plazo_dias integer NOT NULL,
    fecha_desembolso date NOT NULL,
    fecha_vencimiento date NOT NULL,
    estado character varying(20) DEFAULT 'ACTIVO'::character varying,
    monto_pagado numeric(12,2) DEFAULT 0,
    interes_devengado numeric(12,2) DEFAULT 0,
    comision_plataforma numeric(12,2) DEFAULT 0,
    retorno_inversionista numeric(12,2),
    fecha_pago_total timestamp without time zone,
    numero_inversionistas integer DEFAULT 1,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT now(),
    CONSTRAINT estado_crowdlending CHECK (((estado)::text = ANY (ARRAY[('ACTIVO'::character varying)::text, ('PAGADO'::character varying)::text, ('VENCIDO'::character varying)::text, ('RESTRUCTURADO'::character varying)::text])))
);


ALTER TABLE public.crowdlending_operacion OWNER TO postgres;

--
-- TOC entry 478 (class 1259 OID 67935)
-- Name: crowdlending_operacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crowdlending_operacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crowdlending_operacion_id_seq OWNER TO postgres;

--
-- TOC entry 5869 (class 0 OID 0)
-- Dependencies: 478
-- Name: crowdlending_operacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crowdlending_operacion_id_seq OWNED BY public.crowdlending_operacion.id;


--
-- TOC entry 473 (class 1259 OID 67828)
-- Name: cuenta_por_cobrar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_por_cobrar (
    id bigint NOT NULL,
    numero_documento character varying(20) NOT NULL,
    tipo_documento character varying(20) NOT NULL,
    id_factura bigint,
    numero_factura_referencia character varying(20),
    id_cliente bigint NOT NULL,
    id_moneda bigint NOT NULL,
    monto_original numeric(12,2) NOT NULL,
    monto_pendiente numeric(12,2) NOT NULL,
    monto_pagado numeric(12,2) DEFAULT 0,
    saldo_pendiente numeric(12,2) NOT NULL,
    fecha_emision date NOT NULL,
    fecha_vencimiento date NOT NULL,
    dias_vencimiento integer,
    estado_cobranza character varying(20) DEFAULT 'VIGENTE'::character varying,
    estado character varying(20) DEFAULT 'VIGENTE'::character varying,
    clasificacion_riesgo character varying(20) DEFAULT 'NORMAL'::character varying,
    ultima_gestion timestamp without time zone,
    proxima_gestion date,
    id_gestor bigint,
    gestor_cobranza bigint,
    observaciones_cobranza text,
    observaciones text,
    motivo_atraso text,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    CONSTRAINT clasificacion_riesgo_valida CHECK (((clasificacion_riesgo)::text = ANY (ARRAY[('NORMAL'::character varying)::text, ('RIESGO_MEDIO'::character varying)::text, ('RIESGO_ALTO'::character varying)::text, ('INCOBRABLE'::character varying)::text]))),
    CONSTRAINT estado_cobranza_valido CHECK (((estado_cobranza)::text = ANY (ARRAY[('VIGENTE'::character varying)::text, ('VENCIDA'::character varying)::text, ('EN_COBRANZA'::character varying)::text, ('PAGADA'::character varying)::text, ('INCOBRABLE'::character varying)::text])))
);


ALTER TABLE public.cuenta_por_cobrar OWNER TO postgres;

--
-- TOC entry 472 (class 1259 OID 67827)
-- Name: cuenta_por_cobrar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cuenta_por_cobrar_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cuenta_por_cobrar_id_seq OWNER TO postgres;

--
-- TOC entry 5872 (class 0 OID 0)
-- Dependencies: 472
-- Name: cuenta_por_cobrar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuenta_por_cobrar_id_seq OWNED BY public.cuenta_por_cobrar.id;


--
-- TOC entry 453 (class 1259 OID 67369)
-- Name: detalle_solicitud_cotizacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_solicitud_cotizacion (
    id bigint NOT NULL,
    id_solicitud_cotizacion bigint NOT NULL,
    item smallint NOT NULL,
    sku bigint,
    descripcion_producto text NOT NULL,
    marca_preferida character varying(100),
    modelo_referencia character varying(100),
    especificaciones_requeridas text,
    cantidad numeric(10,3) NOT NULL,
    unidad_solicitada character varying(20) DEFAULT 'UND'::character varying,
    precio_referencia_unitario numeric(12,2),
    precio_referencia_total numeric(12,2),
    observaciones text,
    uso_especifico text,
    estado_procesamiento character varying(20) DEFAULT 'PENDIENTE'::character varying,
    cotizado boolean DEFAULT false,
    CONSTRAINT cantidad_positiva_solicitud CHECK ((cantidad > (0)::numeric))
);


ALTER TABLE public.detalle_solicitud_cotizacion OWNER TO postgres;

--
-- TOC entry 452 (class 1259 OID 67368)
-- Name: detalle_solicitud_cotizacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_solicitud_cotizacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_solicitud_cotizacion_id_seq OWNER TO postgres;

--
-- TOC entry 5875 (class 0 OID 0)
-- Dependencies: 452
-- Name: detalle_solicitud_cotizacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_solicitud_cotizacion_id_seq OWNED BY public.detalle_solicitud_cotizacion.id;


--
-- TOC entry 444 (class 1259 OID 67243)
-- Name: direccion_cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.direccion_cliente (
    id bigint NOT NULL,
    id_cliente bigint NOT NULL,
    nombre_direccion character varying(50),
    direccion_linea1 character varying(200) NOT NULL,
    direccion_linea2 character varying(200),
    direccion text NOT NULL,
    referencia character varying(200),
    id_ciudad bigint,
    id_distrito bigint,
    codigo_postal character varying(20),
    id_pais bigint,
    contacto_recepcion character varying(100),
    telefono_contacto character varying(25),
    horario_atencion character varying(100),
    horario_entrega character varying(200),
    instrucciones_entrega text,
    es_direccion_principal boolean DEFAULT false,
    es_direccion_facturacion boolean DEFAULT false,
    es_direccion_entrega boolean DEFAULT false,
    requiere_cita boolean DEFAULT false,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.direccion_cliente OWNER TO postgres;

--
-- TOC entry 443 (class 1259 OID 67242)
-- Name: direccion_cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.direccion_cliente_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.direccion_cliente_id_seq OWNER TO postgres;

--
-- TOC entry 5878 (class 0 OID 0)
-- Dependencies: 443
-- Name: direccion_cliente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.direccion_cliente_id_seq OWNED BY public.direccion_cliente.id;


--
-- TOC entry 398 (class 1259 OID 66701)
-- Name: disponibilidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disponibilidad (
    id bigint NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(150),
    color_hex character varying(7) DEFAULT '#6B7280'::character varying,
    dias_entrega_min smallint DEFAULT 0,
    dias_entrega_max smallint DEFAULT 999,
    stock_requerido boolean DEFAULT false,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.disponibilidad OWNER TO postgres;

--
-- TOC entry 397 (class 1259 OID 66700)
-- Name: disponibilidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disponibilidad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disponibilidad_id_seq OWNER TO postgres;

--
-- TOC entry 5881 (class 0 OID 0)
-- Dependencies: 397
-- Name: disponibilidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disponibilidad_id_seq OWNED BY public.disponibilidad.id;


--
-- TOC entry 392 (class 1259 OID 66667)
-- Name: distrito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.distrito (
    id bigint NOT NULL,
    codigo character varying(10) NOT NULL,
    nombre character varying(100) NOT NULL,
    id_ciudad bigint NOT NULL,
    codigo_postal character varying(20),
    descripcion text,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.distrito OWNER TO postgres;

--
-- TOC entry 391 (class 1259 OID 66666)
-- Name: distrito_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.distrito ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.distrito_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 421 (class 1259 OID 66891)
-- Name: empresa_emisora; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa_emisora (
    id bigint NOT NULL,
    razon_social character varying(150) NOT NULL,
    nombre_comercial character varying(100),
    ruc character varying(11) NOT NULL,
    direccion character varying(300) NOT NULL,
    ubigeo character varying(6),
    telefono character varying(25),
    email character varying(100),
    id_pais bigint NOT NULL,
    logo_url character varying(300),
    certificado_digital text,
    clave_sol character varying(50),
    usuario_sol character varying(50),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.empresa_emisora OWNER TO postgres;

--
-- TOC entry 420 (class 1259 OID 66890)
-- Name: empresa_emisora_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresa_emisora_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empresa_emisora_id_seq OWNER TO postgres;

--
-- TOC entry 5886 (class 0 OID 0)
-- Dependencies: 420
-- Name: empresa_emisora_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresa_emisora_id_seq OWNED BY public.empresa_emisora.id;


--
-- TOC entry 498 (class 1259 OID 86642)
-- Name: estado_cotizacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_cotizacion (
    id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    color character varying(7) DEFAULT '#6B7280'::character varying,
    activo boolean DEFAULT true,
    orden integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    es_estado_final boolean DEFAULT false,
    es_exitoso boolean DEFAULT false
);


ALTER TABLE public.estado_cotizacion OWNER TO postgres;

--
-- TOC entry 497 (class 1259 OID 86641)
-- Name: estado_cotizacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_cotizacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_cotizacion_id_seq OWNER TO postgres;

--
-- TOC entry 5889 (class 0 OID 0)
-- Dependencies: 497
-- Name: estado_cotizacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_cotizacion_id_seq OWNED BY public.estado_cotizacion.id;


--
-- TOC entry 477 (class 1259 OID 67918)
-- Name: factoring_operacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factoring_operacion (
    id bigint NOT NULL,
    numero_operacion character varying(20) NOT NULL,
    entidad_financiera character varying(100) NOT NULL,
    id_factura bigint NOT NULL,
    monto_factura numeric(12,2) NOT NULL,
    monto_adelantado numeric(12,2) NOT NULL,
    tasa_descuento numeric(5,2) NOT NULL,
    comision_fija numeric(8,2) DEFAULT 0,
    gastos_administrativos numeric(8,2) DEFAULT 0,
    monto_neto_recibido numeric(12,2) NOT NULL,
    fecha_operacion date NOT NULL,
    fecha_vencimiento_factura date NOT NULL,
    estado character varying(20) DEFAULT 'VIGENTE'::character varying,
    fecha_cobro_factura date,
    penalidades numeric(8,2) DEFAULT 0,
    costo_financiero_total numeric(8,2),
    tasa_efectiva_anual numeric(6,2),
    dias_financiamiento integer,
    fecha_creacion timestamp without time zone DEFAULT now(),
    CONSTRAINT estado_factoring CHECK (((estado)::text = ANY (ARRAY[('VIGENTE'::character varying)::text, ('COBRADO'::character varying)::text, ('INCOBRABLE'::character varying)::text])))
);


ALTER TABLE public.factoring_operacion OWNER TO postgres;

--
-- TOC entry 476 (class 1259 OID 67917)
-- Name: factoring_operacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.factoring_operacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.factoring_operacion_id_seq OWNER TO postgres;

--
-- TOC entry 5892 (class 0 OID 0)
-- Dependencies: 476
-- Name: factoring_operacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.factoring_operacion_id_seq OWNED BY public.factoring_operacion.id;


--
-- TOC entry 469 (class 1259 OID 67743)
-- Name: factura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factura (
    id bigint NOT NULL,
    numero character varying(20) NOT NULL,
    serie character varying(4) DEFAULT 'F001'::character varying,
    correlativo integer NOT NULL,
    tipo_documento character varying(10) DEFAULT 'FACTURA'::character varying NOT NULL,
    tipo_operacion character varying(4) DEFAULT '0101'::character varying,
    id_empresa_emisora bigint,
    id_pedido bigint,
    numero_pedido_referencia character varying(20),
    id_cliente bigint NOT NULL,
    fecha_emision date DEFAULT CURRENT_DATE NOT NULL,
    fecha_vencimiento date,
    codigo_hash_cpe character varying(100),
    codigo_hash character varying(100),
    numero_autorizacion character varying(50),
    estado_sunat character varying(20) DEFAULT 'PENDIENTE'::character varying,
    mensaje_sunat text,
    xml_firmado text,
    pdf_url character varying(300),
    id_forma_pago bigint,
    id_moneda bigint NOT NULL,
    tipo_cambio numeric(10,4) DEFAULT 1.0000,
    subtotal numeric(12,2) NOT NULL,
    descuento_total numeric(12,2) DEFAULT 0,
    igv numeric(12,2) NOT NULL,
    total numeric(12,2) NOT NULL,
    monto_pagado numeric(12,2) DEFAULT 0,
    saldo_pendiente numeric(12,2),
    estado_pago character varying(20) DEFAULT 'PENDIENTE'::character varying,
    estado_documento character varying(20) DEFAULT 'EMITIDA'::character varying,
    observaciones text,
    glosa text,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    facturado_por bigint,
    creado_por bigint,
    CONSTRAINT factura_estado_check CHECK (((estado_documento)::text = ANY (ARRAY[('EMITIDA'::character varying)::text, ('ENVIADA'::character varying)::text, ('PAGADA'::character varying)::text, ('VENCIDA'::character varying)::text, ('ANULADA'::character varying)::text])))
);


ALTER TABLE public.factura OWNER TO postgres;

--
-- TOC entry 471 (class 1259 OID 67802)
-- Name: factura_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factura_detalle (
    id bigint NOT NULL,
    id_factura bigint NOT NULL,
    item smallint NOT NULL,
    sku bigint,
    descripcion character varying(200) NOT NULL,
    codigo_producto_sunat character varying(20),
    cantidad numeric(10,3) NOT NULL,
    unidad character varying(10) DEFAULT 'NIU'::character varying,
    precio_unitario numeric(12,4) NOT NULL,
    descuento_unitario numeric(12,4) DEFAULT 0,
    descuento numeric(12,2) DEFAULT 0,
    precio_unitario_final numeric(12,4) NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    valor_venta numeric(12,2) NOT NULL,
    codigo_tipo_impuesto character varying(4) DEFAULT '1000'::character varying,
    porcentaje_impuesto numeric(5,2) DEFAULT 18.00,
    monto_impuesto numeric(12,2) NOT NULL,
    igv_linea numeric(12,2) NOT NULL,
    precio_total numeric(12,2) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    CONSTRAINT cantidad_positiva_factura CHECK ((cantidad > (0)::numeric))
);


ALTER TABLE public.factura_detalle OWNER TO postgres;

--
-- TOC entry 470 (class 1259 OID 67801)
-- Name: factura_detalle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.factura_detalle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.factura_detalle_id_seq OWNER TO postgres;

--
-- TOC entry 5896 (class 0 OID 0)
-- Dependencies: 470
-- Name: factura_detalle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.factura_detalle_id_seq OWNED BY public.factura_detalle.id;


--
-- TOC entry 468 (class 1259 OID 67742)
-- Name: factura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.factura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.factura_id_seq OWNER TO postgres;

--
-- TOC entry 5898 (class 0 OID 0)
-- Dependencies: 468
-- Name: factura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.factura_id_seq OWNED BY public.factura.id;


--
-- TOC entry 402 (class 1259 OID 66729)
-- Name: forma_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forma_pago (
    id bigint NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(200),
    dias_credito smallint DEFAULT 0,
    comision_porcentaje numeric(5,2) DEFAULT 0.00,
    requiere_garantia boolean DEFAULT false,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.forma_pago OWNER TO postgres;

--
-- TOC entry 401 (class 1259 OID 66728)
-- Name: forma_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forma_pago_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.forma_pago_id_seq OWNER TO postgres;

--
-- TOC entry 5901 (class 0 OID 0)
-- Dependencies: 401
-- Name: forma_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forma_pago_id_seq OWNED BY public.forma_pago.id;


--
-- TOC entry 483 (class 1259 OID 67991)
-- Name: historial_precios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_precios (
    id bigint NOT NULL,
    sku bigint NOT NULL,
    tipo_precio character varying(20) NOT NULL,
    id_proveedor bigint,
    precio_anterior numeric(12,2),
    precio_nuevo numeric(12,2) NOT NULL,
    id_moneda bigint NOT NULL,
    tipo_cambio_usado numeric(10,4),
    razon_cambio character varying(100),
    motivo_cambio character varying(100),
    porcentaje_cambio numeric(8,4) GENERATED ALWAYS AS (
CASE
    WHEN ((precio_anterior IS NULL) OR (precio_anterior = (0)::numeric)) THEN NULL::numeric
    ELSE (((precio_nuevo - precio_anterior) / precio_anterior) * (100)::numeric)
END) STORED,
    observaciones text,
    fecha_cambio timestamp without time zone DEFAULT now(),
    fecha_efectiva date DEFAULT CURRENT_DATE,
    fecha_registro timestamp without time zone DEFAULT now(),
    aplicado boolean DEFAULT true,
    usuario_responsable bigint,
    id_usuario bigint NOT NULL,
    contexto_evento character varying(50),
    referencia_cotizacion bigint,
    factor_aplicado numeric(6,3),
    CONSTRAINT hp_tipo_precio_check CHECK (((tipo_precio)::text = ANY (ARRAY[('COSTO_PROVEEDOR'::character varying)::text, ('PRECIO_VENTA'::character varying)::text, ('PRECIO_REFERENCIA'::character varying)::text])))
);


ALTER TABLE public.historial_precios OWNER TO postgres;

--
-- TOC entry 482 (class 1259 OID 67990)
-- Name: historial_precios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_precios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_precios_id_seq OWNER TO postgres;

--
-- TOC entry 5904 (class 0 OID 0)
-- Dependencies: 482
-- Name: historial_precios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_precios_id_seq OWNED BY public.historial_precios.id;


--
-- TOC entry 487 (class 1259 OID 68058)
-- Name: inversion_categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inversion_categoria (
    id bigint NOT NULL,
    id_categoria bigint NOT NULL,
    "periodo_año" integer NOT NULL,
    periodo_mes integer NOT NULL,
    tipo_inversion character varying(30) NOT NULL,
    monto_invertido numeric(12,2) NOT NULL,
    id_moneda bigint NOT NULL,
    descripcion character varying(200),
    retorno_esperado_pct numeric(5,2),
    fecha_inversion date NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    CONSTRAINT tipo_inversion_valida CHECK (((tipo_inversion)::text = ANY (ARRAY[('INVENTARIO'::character varying)::text, ('MARKETING'::character varying)::text, ('DESARROLLO'::character varying)::text, ('CAPACITACION'::character varying)::text])))
);


ALTER TABLE public.inversion_categoria OWNER TO postgres;

--
-- TOC entry 486 (class 1259 OID 68057)
-- Name: inversion_categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inversion_categoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inversion_categoria_id_seq OWNER TO postgres;

--
-- TOC entry 5907 (class 0 OID 0)
-- Dependencies: 486
-- Name: inversion_categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inversion_categoria_id_seq OWNED BY public.inversion_categoria.id;


--
-- TOC entry 410 (class 1259 OID 66786)
-- Name: marca; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marca (
    id bigint NOT NULL,
    codigo character varying(20),
    nombre character varying(100) NOT NULL,
    descripcion character varying(300),
    logo_url character varying(300),
    sitio_web character varying(200),
    pais_origen character varying(3),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.marca OWNER TO postgres;

--
-- TOC entry 430 (class 1259 OID 67018)
-- Name: marca_categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marca_categoria (
    id_marca bigint NOT NULL,
    id_categoria bigint NOT NULL,
    es_especialista boolean DEFAULT false,
    activo boolean DEFAULT true NOT NULL,
    fecha_asociacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.marca_categoria OWNER TO postgres;

--
-- TOC entry 409 (class 1259 OID 66785)
-- Name: marca_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marca_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marca_id_seq OWNER TO postgres;

--
-- TOC entry 5911 (class 0 OID 0)
-- Dependencies: 409
-- Name: marca_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marca_id_seq OWNED BY public.marca.id;


--
-- TOC entry 386 (class 1259 OID 66615)
-- Name: moneda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.moneda (
    id bigint NOT NULL,
    codigo character varying(3) NOT NULL,
    nombre character varying(50) NOT NULL,
    simbolo character varying(10) NOT NULL,
    decimales smallint DEFAULT 2,
    tasa_cambio numeric(10,4) DEFAULT 1.0000,
    activo boolean DEFAULT true NOT NULL,
    es_principal boolean DEFAULT false NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now(),
    CONSTRAINT decimales_validos CHECK (((decimales >= 0) AND (decimales <= 4)))
);


ALTER TABLE public.moneda OWNER TO postgres;

--
-- TOC entry 385 (class 1259 OID 66614)
-- Name: moneda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.moneda_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.moneda_id_seq OWNER TO postgres;

--
-- TOC entry 5914 (class 0 OID 0)
-- Dependencies: 385
-- Name: moneda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.moneda_id_seq OWNED BY public.moneda.id;


--
-- TOC entry 455 (class 1259 OID 67394)
-- Name: oportunidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oportunidad (
    id bigint NOT NULL,
    codigo character varying(20),
    nombre character varying(150),
    titulo character varying(200) NOT NULL,
    descripcion text,
    id_cliente bigint,
    id_solicitud_cotizacion bigint,
    id_asesor bigint NOT NULL,
    id_etapa bigint NOT NULL,
    probabilidad_cierre numeric(3,0) DEFAULT 10 NOT NULL,
    probabilidad numeric(3,0),
    valor_estimado numeric(12,2),
    id_moneda_valor bigint,
    fecha_identificacion date DEFAULT CURRENT_DATE NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_cierre_estimada date,
    fecha_cierre_real date,
    fecha_ultimo_contacto date,
    fecha_proximo_contacto date,
    ultima_actividad timestamp without time zone,
    proxima_actividad timestamp without time zone,
    estado character varying(20) DEFAULT 'ACTIVA'::character varying,
    motivo_perdida text,
    razon_perdida character varying(200),
    origen character varying(30) DEFAULT 'PROSPECTING'::character varying,
    canal_origen character varying(30),
    fuente_lead character varying(50),
    campana_origen character varying(100),
    dias_en_pipeline integer DEFAULT 0,
    dias_en_etapa_actual integer DEFAULT 0,
    competencia_identificada text,
    competidor character varying(100),
    diferenciadores_clave text,
    observaciones text,
    siguiente_accion text,
    activo boolean DEFAULT true NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now(),
    CONSTRAINT estado_oportunidad_valido CHECK (((estado)::text = ANY (ARRAY[('ACTIVA'::character varying)::text, ('GANADA'::character varying)::text, ('PERDIDA'::character varying)::text, ('SUSPENDIDA'::character varying)::text, ('PAUSADA'::character varying)::text]))),
    CONSTRAINT probabilidad_valida_opo2 CHECK (((probabilidad >= (0)::numeric) AND (probabilidad <= (100)::numeric))),
    CONSTRAINT probabilidad_valida_oportunidad CHECK (((probabilidad_cierre >= (0)::numeric) AND (probabilidad_cierre <= (100)::numeric)))
);


ALTER TABLE public.oportunidad OWNER TO postgres;

--
-- TOC entry 454 (class 1259 OID 67393)
-- Name: oportunidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.oportunidad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.oportunidad_id_seq OWNER TO postgres;

--
-- TOC entry 5917 (class 0 OID 0)
-- Dependencies: 454
-- Name: oportunidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.oportunidad_id_seq OWNED BY public.oportunidad.id;


--
-- TOC entry 475 (class 1259 OID 67872)
-- Name: pago_recibido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pago_recibido (
    id bigint NOT NULL,
    numero_recibo character varying(20) NOT NULL,
    id_cuenta_por_cobrar bigint NOT NULL,
    numero_documento_referencia character varying(20),
    id_cliente bigint NOT NULL,
    id_forma_pago bigint NOT NULL,
    fecha_pago date DEFAULT CURRENT_DATE NOT NULL,
    metodo_pago character varying(30) NOT NULL,
    id_moneda bigint NOT NULL,
    monto_pagado numeric(12,2) NOT NULL,
    tipo_cambio_aplicado numeric(10,4) DEFAULT 1.0000,
    monto_equivalente_soles numeric(12,2),
    banco character varying(100),
    numero_operacion character varying(50),
    numero_cheque character varying(20),
    fecha_cheque date,
    referencia character varying(100),
    estado_pago character varying(20) DEFAULT 'CONFIRMADO'::character varying,
    observaciones text,
    observaciones_banco text,
    registrado_por bigint,
    recibido_por bigint,
    fecha_registro timestamp without time zone DEFAULT now(),
    CONSTRAINT estado_pago_valido CHECK (((estado_pago)::text = ANY (ARRAY[('PENDIENTE'::character varying)::text, ('CONFIRMADO'::character varying)::text, ('RECHAZADO'::character varying)::text, ('ANULADO'::character varying)::text])))
);


ALTER TABLE public.pago_recibido OWNER TO postgres;

--
-- TOC entry 474 (class 1259 OID 67871)
-- Name: pago_recibido_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pago_recibido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pago_recibido_id_seq OWNER TO postgres;

--
-- TOC entry 5920 (class 0 OID 0)
-- Dependencies: 474
-- Name: pago_recibido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pago_recibido_id_seq OWNED BY public.pago_recibido.id;


--
-- TOC entry 388 (class 1259 OID 66631)
-- Name: pais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pais (
    id bigint NOT NULL,
    nombre character varying(80) NOT NULL,
    iso_code character varying(3) NOT NULL,
    iso_code_2 character varying(2) NOT NULL,
    codigo character varying(3) NOT NULL,
    id_moneda_principal bigint,
    prefijo_telefonico character varying(5),
    codigo_telefono character varying(5),
    moneda_local character varying(3),
    nombre_doc_personal character varying(50),
    nombre_doc_empresa character varying(50),
    patron_telefono character varying(100),
    patron_doc_personal character varying(100),
    patron_doc_empresa character varying(100),
    zona_horaria character varying(50),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pais OWNER TO postgres;

--
-- TOC entry 387 (class 1259 OID 66630)
-- Name: pais_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pais_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pais_id_seq OWNER TO postgres;

--
-- TOC entry 5923 (class 0 OID 0)
-- Dependencies: 387
-- Name: pais_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pais_id_seq OWNED BY public.pais.id;


--
-- TOC entry 465 (class 1259 OID 67640)
-- Name: pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedido (
    id bigint NOT NULL,
    numero character varying(20) NOT NULL,
    id_cotizacion bigint,
    numero_cotizacion_referencia character varying(20),
    id_cliente bigint NOT NULL,
    id_direccion_envio bigint,
    id_direccion_facturacion bigint,
    id_asesor_ventas bigint,
    id_asesor bigint,
    fecha_pedido date DEFAULT CURRENT_DATE NOT NULL,
    fecha_entrega_solicitada date,
    fecha_entrega_prometida date,
    fecha_entrega_real date,
    fecha_estimada_entrega date,
    direccion_entrega text,
    contacto_recepcion character varying(100),
    telefono_contacto_entrega character varying(25),
    instrucciones_entrega text,
    transportista character varying(100),
    codigo_seguimiento character varying(100),
    id_forma_pago bigint,
    id_condiciones_comerciales bigint,
    metodo_pago character varying(50),
    referencia_pago character varying(100),
    fecha_pago timestamp without time zone,
    id_moneda bigint NOT NULL,
    tipo_cambio_usado numeric(10,4),
    fecha_tipo_cambio timestamp without time zone,
    subtotal numeric(12,2) NOT NULL,
    descuento_total numeric(12,2) DEFAULT 0,
    igv numeric(12,2) NOT NULL,
    impuestos numeric(12,2) NOT NULL,
    total numeric(12,2) NOT NULL,
    costo_envio numeric(12,2) DEFAULT 0,
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying,
    estado_pago character varying(20) DEFAULT 'PENDIENTE'::character varying,
    prioridad character varying(10) DEFAULT 'NORMAL'::character varying,
    canal_venta character varying(20) DEFAULT 'WEB'::character varying,
    observaciones_cliente text,
    observaciones_internas text,
    notas_cliente text,
    notas_internas text,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now(),
    fecha_ultima_modificacion timestamp without time zone DEFAULT now(),
    CONSTRAINT estado_pago_valido CHECK (((estado_pago)::text = ANY (ARRAY[('PENDIENTE'::character varying)::text, ('PAGADO'::character varying)::text, ('PARCIAL'::character varying)::text, ('REEMBOLSADO'::character varying)::text]))),
    CONSTRAINT estado_pedido_valido CHECK (((estado)::text = ANY (ARRAY[('PENDIENTE'::character varying)::text, ('CONFIRMADO'::character varying)::text, ('PROCESANDO'::character varying)::text, ('ENVIADO'::character varying)::text, ('ENTREGADO'::character varying)::text, ('CANCELADO'::character varying)::text]))),
    CONSTRAINT pedido_estado_check CHECK (((estado)::text = ANY (ARRAY[('PENDIENTE'::character varying)::text, ('CONFIRMADO'::character varying)::text, ('PROCESANDO'::character varying)::text, ('ENVIADO'::character varying)::text, ('ENTREGADO'::character varying)::text, ('CANCELADO'::character varying)::text])))
);


ALTER TABLE public.pedido OWNER TO postgres;

--
-- TOC entry 467 (class 1259 OID 67710)
-- Name: pedido_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedido_detalle (
    id bigint NOT NULL,
    id_pedido bigint NOT NULL,
    item smallint NOT NULL,
    sku bigint,
    descripcion character varying(200),
    especificaciones_cliente text,
    cantidad numeric(10,3) NOT NULL,
    precio_unitario numeric(12,2) NOT NULL,
    descuento_unitario numeric(12,2) DEFAULT 0,
    precio_unitario_final numeric(12,2) NOT NULL,
    precio_total numeric(12,2) NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    cantidad_entregada numeric(10,3) DEFAULT 0,
    fecha_entrega_programada date,
    fecha_reserva_stock timestamp without time zone,
    estado_item character varying(20) DEFAULT 'PENDIENTE'::character varying,
    estado_producto character varying(20) DEFAULT 'PENDIENTE'::character varying,
    id_proveedor_asignado bigint,
    numero_orden_proveedor character varying(50),
    fecha_orden_proveedor date,
    id_promocion bigint,
    descripcion_promocion character varying(200),
    observaciones text,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    CONSTRAINT cantidad_positiva_pedido CHECK ((cantidad > (0)::numeric))
);


ALTER TABLE public.pedido_detalle OWNER TO postgres;

--
-- TOC entry 466 (class 1259 OID 67709)
-- Name: pedido_detalle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedido_detalle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_detalle_id_seq OWNER TO postgres;

--
-- TOC entry 5927 (class 0 OID 0)
-- Dependencies: 466
-- Name: pedido_detalle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedido_detalle_id_seq OWNED BY public.pedido_detalle.id;


--
-- TOC entry 464 (class 1259 OID 67639)
-- Name: pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_id_seq OWNER TO postgres;

--
-- TOC entry 5929 (class 0 OID 0)
-- Dependencies: 464
-- Name: pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedido_id_seq OWNED BY public.pedido.id;


--
-- TOC entry 451 (class 1259 OID 67359)
-- Name: procesamiento_archivo_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procesamiento_archivo_log (
    id bigint NOT NULL,
    id_archivo bigint NOT NULL,
    paso character varying(50) NOT NULL,
    estado character varying(20) NOT NULL,
    mensaje text,
    tiempo_procesamiento_ms integer,
    fecha_proceso timestamp without time zone DEFAULT now()
);


ALTER TABLE public.procesamiento_archivo_log OWNER TO postgres;

--
-- TOC entry 450 (class 1259 OID 67358)
-- Name: procesamiento_archivo_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procesamiento_archivo_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.procesamiento_archivo_log_id_seq OWNER TO postgres;

--
-- TOC entry 5932 (class 0 OID 0)
-- Dependencies: 450
-- Name: procesamiento_archivo_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.procesamiento_archivo_log_id_seq OWNED BY public.procesamiento_archivo_log.id;


--
-- TOC entry 434 (class 1259 OID 67074)
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto (
    sku bigint NOT NULL,
    sku_producto character varying(50),
    cod_producto_marca character varying(30),
    nombre character varying(150) NOT NULL,
    descripcion_corta character varying(500),
    descripcion_detallada text,
    especificaciones_tecnicas text,
    aplicaciones text,
    material character varying(100),
    origen character varying(50),
    id_categoria bigint NOT NULL,
    id_marca bigint NOT NULL,
    id_unidad bigint,
    id_disponibilidad bigint NOT NULL,
    peso_kg numeric(10,4),
    dimensiones character varying(100),
    volumen_m3 numeric(10,6),
    precio_referencia numeric(12,2),
    id_moneda_referencia bigint,
    margen_minimo numeric(5,2) DEFAULT 0,
    margen_sugerido numeric(5,2) DEFAULT 15.00,
    costo_proveedor numeric(12,2),
    id_moneda_costo bigint,
    ultimo_tipo_cambio numeric(10,4) DEFAULT 1,
    precio_venta numeric(12,2),
    id_moneda_venta bigint,
    margen_aplicado numeric(5,2),
    id_proveedor_principal bigint,
    requiere_stock boolean DEFAULT false,
    stock_minimo integer DEFAULT 0,
    punto_reorden integer DEFAULT 0,
    codigo_arancelario character varying(20),
    es_importado boolean DEFAULT false,
    tiempo_importacion_dias smallint,
    imagen_principal_url character varying(500),
    galeria_imagenes_urls text[],
    seo_title character varying(60),
    seo_description character varying(160),
    seo_keywords text,
    seo_slug character varying(100),
    meta_robots character varying(50) DEFAULT 'index,follow'::character varying,
    canonical_url character varying(300),
    structured_data jsonb,
    seo_score integer DEFAULT 0,
    seo_optimizado boolean DEFAULT false,
    tags text[],
    es_destacado boolean DEFAULT false,
    es_novedad boolean DEFAULT false,
    es_promocion boolean DEFAULT false,
    activo boolean DEFAULT true NOT NULL,
    visible_web boolean DEFAULT true,
    requiere_aprobacion boolean DEFAULT false,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now(),
    creado_por bigint,
    actualizado_por bigint,
    CONSTRAINT producto_descripcion_corta_check CHECK ((length((descripcion_corta)::text) < 500))
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- TOC entry 5934 (class 0 OID 0)
-- Dependencies: 434
-- Name: TABLE producto; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.producto IS 'Catálogo principal de productos del marketplace B2B INXORA';


--
-- TOC entry 5935 (class 0 OID 0)
-- Dependencies: 434
-- Name: COLUMN producto.precio_referencia; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.producto.precio_referencia IS 'Precio de referencia público (sin mostrar costos internos)';


--
-- TOC entry 515 (class 1259 OID 106228)
-- Name: producto_precio_moneda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto_precio_moneda (
    id bigint NOT NULL,
    sku bigint,
    id_moneda bigint,
    precio_venta numeric(12,2),
    margen_aplicado numeric(5,2),
    fecha_vigencia_desde date DEFAULT CURRENT_DATE,
    fecha_vigencia_hasta date,
    activo boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now(),
    creado_por bigint,
    actualizado_por bigint,
    observaciones text,
    CONSTRAINT margen_valido CHECK (((margen_aplicado >= (0)::numeric) AND (margen_aplicado < (100)::numeric))),
    CONSTRAINT precio_positivo CHECK ((precio_venta > (0)::numeric))
);


ALTER TABLE public.producto_precio_moneda OWNER TO postgres;

--
-- TOC entry 514 (class 1259 OID 106227)
-- Name: producto_precio_moneda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_precio_moneda_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_precio_moneda_id_seq OWNER TO postgres;

--
-- TOC entry 5938 (class 0 OID 0)
-- Dependencies: 514
-- Name: producto_precio_moneda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_precio_moneda_id_seq OWNED BY public.producto_precio_moneda.id;


--
-- TOC entry 436 (class 1259 OID 67155)
-- Name: producto_proveedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto_proveedor (
    id bigint NOT NULL,
    sku bigint NOT NULL,
    id_proveedor bigint NOT NULL,
    codigo_proveedor character varying(50),
    precio_costo numeric(12,2) NOT NULL,
    id_moneda_costo bigint,
    tiempo_entrega_dias smallint DEFAULT 0,
    stock_disponible integer DEFAULT 0,
    minimo_pedido numeric(10,3) DEFAULT 1,
    es_proveedor_principal boolean DEFAULT false,
    margen_aplicado numeric(5,2),
    fecha_ultima_cotizacion timestamp without time zone,
    observaciones text,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now(),
    precio_incluye_igv boolean DEFAULT false
);


ALTER TABLE public.producto_proveedor OWNER TO postgres;

--
-- TOC entry 5940 (class 0 OID 0)
-- Dependencies: 436
-- Name: TABLE producto_proveedor; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.producto_proveedor IS 'Relación many-to-many entre productos y proveedores con precios específicos';


--
-- TOC entry 5941 (class 0 OID 0)
-- Dependencies: 436
-- Name: COLUMN producto_proveedor.precio_costo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.producto_proveedor.precio_costo IS 'Precio de costo real del proveedor (información interna)';


--
-- TOC entry 435 (class 1259 OID 67154)
-- Name: producto_proveedor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_proveedor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_proveedor_id_seq OWNER TO postgres;

--
-- TOC entry 5943 (class 0 OID 0)
-- Dependencies: 435
-- Name: producto_proveedor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_proveedor_id_seq OWNED BY public.producto_proveedor.id;


--
-- TOC entry 433 (class 1259 OID 67073)
-- Name: producto_sku_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_sku_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_sku_seq OWNER TO postgres;

--
-- TOC entry 5945 (class 0 OID 0)
-- Dependencies: 433
-- Name: producto_sku_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_sku_seq OWNED BY public.producto.sku;


--
-- TOC entry 438 (class 1259 OID 67188)
-- Name: promocion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promocion (
    id bigint NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    fecha_inicio timestamp without time zone NOT NULL,
    fecha_fin timestamp without time zone NOT NULL,
    activa boolean DEFAULT false,
    aplicacion_automatica boolean DEFAULT true,
    prioridad smallint DEFAULT 1,
    limite_uso_total bigint,
    limite_uso_por_cliente integer DEFAULT 1,
    monto_minimo_compra numeric(12,2),
    fecha_creacion timestamp without time zone DEFAULT now(),
    creado_por bigint,
    CONSTRAINT fechas_validas CHECK ((fecha_fin > fecha_inicio))
);


ALTER TABLE public.promocion OWNER TO postgres;

--
-- TOC entry 440 (class 1259 OID 67208)
-- Name: promocion_descuento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promocion_descuento (
    id bigint NOT NULL,
    id_promocion bigint,
    tipo_aplicacion character varying(20) NOT NULL,
    referencia_id bigint,
    tipo_descuento character varying(20) NOT NULL,
    valor_descuento numeric(12,3) NOT NULL,
    descuento_maximo numeric(12,2),
    aplicar_sobre character varying(20) DEFAULT 'PRECIO_FINAL'::character varying,
    activo boolean DEFAULT true,
    CONSTRAINT tipo_aplicacion_valido CHECK (((tipo_aplicacion)::text = ANY (ARRAY[('GLOBAL'::character varying)::text, ('CATEGORIA'::character varying)::text, ('PRODUCTO'::character varying)::text, ('CLIENTE'::character varying)::text, ('RUBRO'::character varying)::text]))),
    CONSTRAINT tipo_descuento_valido CHECK (((tipo_descuento)::text = ANY (ARRAY[('PORCENTAJE'::character varying)::text, ('MONTO_FIJO'::character varying)::text, ('PRECIO_ESPECIAL'::character varying)::text])))
);


ALTER TABLE public.promocion_descuento OWNER TO postgres;

--
-- TOC entry 439 (class 1259 OID 67207)
-- Name: promocion_descuento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promocion_descuento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promocion_descuento_id_seq OWNER TO postgres;

--
-- TOC entry 5949 (class 0 OID 0)
-- Dependencies: 439
-- Name: promocion_descuento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promocion_descuento_id_seq OWNED BY public.promocion_descuento.id;


--
-- TOC entry 437 (class 1259 OID 67187)
-- Name: promocion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promocion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promocion_id_seq OWNER TO postgres;

--
-- TOC entry 5951 (class 0 OID 0)
-- Dependencies: 437
-- Name: promocion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promocion_id_seq OWNED BY public.promocion.id;


--
-- TOC entry 442 (class 1259 OID 67224)
-- Name: promocion_uso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promocion_uso (
    id bigint NOT NULL,
    id_promocion bigint,
    id_cliente bigint,
    tipo_transaccion character varying(20) NOT NULL,
    referencia_transaccion bigint NOT NULL,
    monto_descuento numeric(12,2) NOT NULL,
    porcentaje_aplicado numeric(5,2),
    productos_afectados integer,
    fecha_uso timestamp without time zone DEFAULT now(),
    CONSTRAINT tipo_transaccion_valido CHECK (((tipo_transaccion)::text = ANY (ARRAY[('COTIZACION'::character varying)::text, ('PEDIDO'::character varying)::text, ('CONSULTA'::character varying)::text])))
);


ALTER TABLE public.promocion_uso OWNER TO postgres;

--
-- TOC entry 441 (class 1259 OID 67223)
-- Name: promocion_uso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promocion_uso_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promocion_uso_id_seq OWNER TO postgres;

--
-- TOC entry 5954 (class 0 OID 0)
-- Dependencies: 441
-- Name: promocion_uso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promocion_uso_id_seq OWNED BY public.promocion_uso.id;


--
-- TOC entry 423 (class 1259 OID 66909)
-- Name: proveedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proveedor (
    id bigint NOT NULL,
    codigo character varying(20),
    razon_social character varying(150) NOT NULL,
    nombre_comercial character varying(100),
    documento_empresa character varying(25),
    tipo_documento character varying(10) DEFAULT 'RUC'::character varying,
    nombre_contacto character varying(80),
    apellidos_contacto character varying(80),
    correo character varying(100),
    correo_facturacion character varying(100),
    telefono character varying(25),
    whatsapp character varying(25),
    direccion character varying(300),
    id_ciudad bigint,
    id_pais bigint,
    sitio_web character varying(200),
    soporte_productos boolean DEFAULT false,
    entrega_nacional boolean DEFAULT true,
    entrega_internacional boolean DEFAULT false,
    margen_negociado numeric(5,2),
    dias_pago_promedio smallint DEFAULT 30,
    id_condiciones_comerciales bigint,
    activo boolean DEFAULT true,
    fecha_registro timestamp without time zone DEFAULT now(),
    ultima_cotizacion timestamp without time zone,
    notas_internas text,
    CONSTRAINT proveedor_razon_social_check CHECK ((length((razon_social)::text) >= 3))
);


ALTER TABLE public.proveedor OWNER TO postgres;

--
-- TOC entry 5956 (class 0 OID 0)
-- Dependencies: 423
-- Name: TABLE proveedor; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.proveedor IS 'Proveedores y distribuidores del marketplace';


--
-- TOC entry 432 (class 1259 OID 67055)
-- Name: proveedor_categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proveedor_categoria (
    id_proveedor bigint NOT NULL,
    id_categoria bigint NOT NULL,
    especialidad_nivel character varying(20) DEFAULT 'GENERAL'::character varying,
    fecha_asociacion timestamp without time zone DEFAULT now(),
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.proveedor_categoria OWNER TO postgres;

--
-- TOC entry 422 (class 1259 OID 66908)
-- Name: proveedor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proveedor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proveedor_id_seq OWNER TO postgres;

--
-- TOC entry 5959 (class 0 OID 0)
-- Dependencies: 422
-- Name: proveedor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proveedor_id_seq OWNED BY public.proveedor.id;


--
-- TOC entry 431 (class 1259 OID 67036)
-- Name: proveedor_marca; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proveedor_marca (
    id_proveedor bigint NOT NULL,
    id_marca bigint NOT NULL,
    es_distribuidor_oficial boolean DEFAULT false,
    descuento_especial numeric(5,2) DEFAULT 0,
    fecha_asociacion timestamp without time zone DEFAULT now(),
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.proveedor_marca OWNER TO postgres;

--
-- TOC entry 424 (class 1259 OID 66946)
-- Name: recogedores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.recogedores ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.recogedores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 394 (class 1259 OID 66682)
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(50),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- TOC entry 393 (class 1259 OID 66681)
-- Name: rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_id_seq OWNER TO postgres;

--
-- TOC entry 5964 (class 0 OID 0)
-- Dependencies: 393
-- Name: rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_id_seq OWNED BY public.rol.id;


--
-- TOC entry 406 (class 1259 OID 66764)
-- Name: rubro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rubro (
    id bigint NOT NULL,
    codigo character varying(100) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(300),
    sector_economico character varying(50),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.rubro OWNER TO postgres;

--
-- TOC entry 405 (class 1259 OID 66763)
-- Name: rubro_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rubro_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rubro_id_seq OWNER TO postgres;

--
-- TOC entry 5967 (class 0 OID 0)
-- Dependencies: 405
-- Name: rubro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rubro_id_seq OWNED BY public.rubro.id;


--
-- TOC entry 449 (class 1259 OID 67345)
-- Name: solicitud_archivo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitud_archivo (
    id_solicitud_cotizacion bigint NOT NULL,
    id_archivo bigint NOT NULL,
    tipo_documento character varying(30),
    es_principal boolean DEFAULT false,
    orden integer DEFAULT 1,
    revisado_por_asesor boolean DEFAULT false,
    fecha_revision timestamp without time zone
);


ALTER TABLE public.solicitud_archivo OWNER TO postgres;

--
-- TOC entry 446 (class 1259 OID 67278)
-- Name: solicitud_cotizacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitud_cotizacion (
    id bigint NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre_cliente character varying(100),
    nombre_completo character varying(100) NOT NULL,
    empresa character varying(150),
    email character varying(100) NOT NULL,
    correo character varying(100),
    telefono character varying(25),
    whatsapp character varying(25),
    whatsapp_numero character varying(25),
    cargo character varying(50),
    razon_social character varying(150),
    ruc character varying(11),
    rubro_empresa character varying(100),
    direccion text,
    descripcion_necesidad text,
    requerimiento text NOT NULL,
    presupuesto_aproximado numeric(12,2),
    presupuesto_referencial numeric(12,2),
    cantidad_estimada character varying(50),
    uso_previsto text,
    canal_origen character varying(20) NOT NULL,
    referencia_origen character varying(100),
    urgencia character varying(20) DEFAULT 'MEDIA'::character varying,
    urgente boolean DEFAULT false,
    origen_solicitud character varying(20) DEFAULT 'WEB'::character varying,
    canal_preferido character varying(20) DEFAULT 'EMAIL'::character varying,
    email_remitente character varying(100),
    estado character varying(20) DEFAULT 'NUEVA'::character varying,
    sub_estado character varying(30),
    prioridad character varying(20) DEFAULT 'NORMAL'::character varying,
    puntuacion_lead smallint DEFAULT 50,
    probabilidad_cierre numeric(3,0) DEFAULT 30,
    valor_estimado numeric(12,2),
    id_asesor_asignado bigint,
    fecha_asignacion timestamp without time zone,
    id_cliente_creado bigint,
    id_cotizacion_generada bigint,
    fecha_conversion timestamp without time zone,
    requiere_visita_tecnica boolean DEFAULT false,
    direccion_visita text,
    fecha_visita_programada timestamp without time zone,
    resultado_visita text,
    observaciones_cliente text,
    observaciones_internas text,
    motivo_rechazo text,
    motivo_no_cotizada character varying(200),
    fecha_solicitud timestamp without time zone DEFAULT now(),
    fecha_primer_contacto timestamp without time zone,
    fecha_limite_respuesta timestamp without time zone,
    fecha_cierre timestamp without time zone,
    tiempo_respuesta_horas integer,
    numero_seguimientos integer DEFAULT 0,
    total_archivos integer DEFAULT 0,
    archivos_procesados integer DEFAULT 0,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_ultima_actualizacion timestamp without time zone DEFAULT now(),
    creado_por bigint,
    ip_origen inet,
    user_agent text,
    CONSTRAINT estado_solicitud_valido CHECK (((estado)::text = ANY (ARRAY[('NUEVA'::character varying)::text, ('ASIGNADA'::character varying)::text, ('EN_PROCESO'::character varying)::text, ('COTIZADA'::character varying)::text, ('CERRADA_EXITOSA'::character varying)::text, ('CERRADA_PERDIDA'::character varying)::text, ('RECHAZADA'::character varying)::text]))),
    CONSTRAINT origen_valido CHECK (((origen_solicitud)::text = ANY (ARRAY[('WEB'::character varying)::text, ('TELEFONO'::character varying)::text, ('EMAIL'::character varying)::text, ('WHATSAPP'::character varying)::text, ('REFERIDO'::character varying)::text, ('FERIA'::character varying)::text]))),
    CONSTRAINT probabilidad_valida CHECK (((probabilidad_cierre >= (0)::numeric) AND (probabilidad_cierre <= (100)::numeric))),
    CONSTRAINT urgencia_valida CHECK (((urgencia)::text = ANY (ARRAY[('BAJA'::character varying)::text, ('MEDIA'::character varying)::text, ('ALTA'::character varying)::text, ('URGENTE'::character varying)::text])))
);


ALTER TABLE public.solicitud_cotizacion OWNER TO postgres;

--
-- TOC entry 5970 (class 0 OID 0)
-- Dependencies: 446
-- Name: TABLE solicitud_cotizacion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.solicitud_cotizacion IS 'Leads y solicitudes de cotización del marketplace';


--
-- TOC entry 5971 (class 0 OID 0)
-- Dependencies: 446
-- Name: COLUMN solicitud_cotizacion.codigo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.solicitud_cotizacion.codigo IS 'Código único generado automáticamente con trigger';


--
-- TOC entry 445 (class 1259 OID 67277)
-- Name: solicitud_cotizacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitud_cotizacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitud_cotizacion_id_seq OWNER TO postgres;

--
-- TOC entry 5973 (class 0 OID 0)
-- Dependencies: 445
-- Name: solicitud_cotizacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitud_cotizacion_id_seq OWNED BY public.solicitud_cotizacion.id;


--
-- TOC entry 396 (class 1259 OID 66693)
-- Name: tipo_cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_cliente (
    id bigint NOT NULL,
    nombre character varying(30) NOT NULL,
    descripcion character varying(100),
    CONSTRAINT tipo_cliente_check CHECK (((nombre)::text = ANY (ARRAY[('PERSONA_NATURAL'::character varying)::text, ('EMPRESA'::character varying)::text])))
);


ALTER TABLE public.tipo_cliente OWNER TO postgres;

--
-- TOC entry 384 (class 1259 OID 58674)
-- Name: tipo_cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_cliente_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_cliente_id_seq OWNER TO postgres;

--
-- TOC entry 395 (class 1259 OID 66692)
-- Name: tipo_cliente_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_cliente_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_cliente_id_seq1 OWNER TO postgres;

--
-- TOC entry 5977 (class 0 OID 0)
-- Dependencies: 395
-- Name: tipo_cliente_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_cliente_id_seq1 OWNED BY public.tipo_cliente.id;


--
-- TOC entry 500 (class 1259 OID 89061)
-- Name: tipo_contacto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_contacto (
    id bigint NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(200),
    color character varying(7) DEFAULT '#6B7280'::character varying,
    orden_secuencial smallint NOT NULL,
    permite_cotizar boolean DEFAULT true,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tipo_contacto OWNER TO postgres;

--
-- TOC entry 499 (class 1259 OID 89060)
-- Name: tipo_contacto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_contacto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_contacto_id_seq OWNER TO postgres;

--
-- TOC entry 5980 (class 0 OID 0)
-- Dependencies: 499
-- Name: tipo_contacto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_contacto_id_seq OWNED BY public.tipo_contacto.id;


--
-- TOC entry 502 (class 1259 OID 90344)
-- Name: transicion_estado_cotizacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transicion_estado_cotizacion (
    id bigint NOT NULL,
    id_cotizacion bigint NOT NULL,
    estado_anterior_id integer,
    estado_nuevo_id integer NOT NULL,
    motivo text,
    observaciones text,
    probabilidad_anterior numeric(5,2),
    probabilidad_nueva numeric(5,2),
    valor_estimado numeric(12,2),
    fecha_transicion timestamp without time zone DEFAULT now() NOT NULL,
    dias_en_estado_anterior integer DEFAULT 0,
    usuario_responsable bigint,
    automatico boolean DEFAULT false,
    ip_origen inet,
    user_agent text,
    canal_origen character varying(50),
    valor_cotizacion_momento numeric(12,2),
    margen_estimado numeric(5,2),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.transicion_estado_cotizacion OWNER TO postgres;

--
-- TOC entry 501 (class 1259 OID 90343)
-- Name: transicion_estado_cotizacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transicion_estado_cotizacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transicion_estado_cotizacion_id_seq OWNER TO postgres;

--
-- TOC entry 5983 (class 0 OID 0)
-- Dependencies: 501
-- Name: transicion_estado_cotizacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transicion_estado_cotizacion_id_seq OWNED BY public.transicion_estado_cotizacion.id;


--
-- TOC entry 400 (class 1259 OID 66716)
-- Name: unidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unidad (
    id bigint NOT NULL,
    codigo character varying(10) NOT NULL,
    nombre character varying(50) NOT NULL,
    simbolo character varying(10),
    tipo character varying(20) DEFAULT 'CANTIDAD'::character varying,
    factor_conversion_base numeric(10,4) DEFAULT 1.0000,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.unidad OWNER TO postgres;

--
-- TOC entry 399 (class 1259 OID 66715)
-- Name: unidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unidad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unidad_id_seq OWNER TO postgres;

--
-- TOC entry 5986 (class 0 OID 0)
-- Dependencies: 399
-- Name: unidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unidad_id_seq OWNED BY public.unidad.id;


--
-- TOC entry 415 (class 1259 OID 66826)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    apellidos character varying(50) NOT NULL,
    correo character varying(100) NOT NULL,
    es_asesor_ventas boolean DEFAULT false,
    telefono_directo character varying(25),
    email_comercial character varying(100),
    firma_comercial text,
    activo boolean DEFAULT true NOT NULL,
    auth_user_id uuid,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_actualizacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 417 (class 1259 OID 66838)
-- Name: usuario_rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_rol (
    id bigint NOT NULL,
    id_usuario bigint NOT NULL,
    id_rol bigint NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT now(),
    asignado_por bigint,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.usuario_rol OWNER TO postgres;

--
-- TOC entry 416 (class 1259 OID 66837)
-- Name: usuario_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_rol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_rol_id_seq OWNER TO postgres;

--
-- TOC entry 5990 (class 0 OID 0)
-- Dependencies: 416
-- Name: usuario_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_rol_id_seq OWNED BY public.usuario_rol.id;


--
-- TOC entry 505 (class 1259 OID 90397)
-- Name: v_analisis_perdidas; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_analisis_perdidas AS
 SELECT ec_origen.nombre AS estado_donde_se_pierde,
    count(*) AS total_perdidas,
    avg(t.valor_estimado) AS valor_promedio_perdido,
    avg(t.dias_en_estado_anterior) AS dias_promedio_antes_perder,
    sum(t.valor_estimado) AS valor_total_perdido,
    count(
        CASE
            WHEN (t.fecha_transicion >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone)) THEN 1
            ELSE NULL::integer
        END) AS perdidas_este_mes
   FROM ((public.transicion_estado_cotizacion t
     JOIN public.estado_cotizacion ec_origen ON ((t.estado_anterior_id = ec_origen.id)))
     JOIN public.estado_cotizacion ec_destino ON ((t.estado_nuevo_id = ec_destino.id)))
  WHERE (((ec_destino.codigo)::text = 'PERDIDO'::text) AND (t.fecha_transicion >= (now() - '6 mons'::interval)))
  GROUP BY ec_origen.id, ec_origen.nombre
  ORDER BY (sum(t.valor_estimado)) DESC;


ALTER VIEW public.v_analisis_perdidas OWNER TO postgres;

--
-- TOC entry 496 (class 1259 OID 78223)
-- Name: v_analisis_precios_calculados; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_analisis_precios_calculados AS
 SELECT p.sku,
    p.sku_producto AS codigo,
    p.nombre,
    p.costo_proveedor,
    p.ultimo_tipo_cambio,
    (p.costo_proveedor * p.ultimo_tipo_cambio) AS costo_convertido,
    p.margen_aplicado,
    p.precio_venta,
    round(((p.costo_proveedor * p.ultimo_tipo_cambio) / ((1)::numeric - (p.margen_aplicado / 100.0))), 2) AS precio_calculado_verificacion,
    round((((p.precio_venta - (p.costo_proveedor * p.ultimo_tipo_cambio)) / p.precio_venta) * (100)::numeric), 2) AS margen_real_pct,
    abs((p.precio_venta - round(((p.costo_proveedor * p.ultimo_tipo_cambio) / ((1)::numeric - (p.margen_aplicado / 100.0))), 2))) AS diferencia_calculo,
    c.nombre AS categoria,
    prov.razon_social AS proveedor,
    p.fecha_actualizacion
   FROM ((public.producto p
     LEFT JOIN public.categoria c ON ((c.id = p.id_categoria)))
     LEFT JOIN public.proveedor prov ON ((prov.id = p.id_proveedor_principal)))
  WHERE ((p.activo = true) AND (p.costo_proveedor IS NOT NULL) AND (p.margen_aplicado IS NOT NULL))
  ORDER BY p.fecha_actualizacion DESC;


ALTER VIEW public.v_analisis_precios_calculados OWNER TO postgres;

--
-- TOC entry 506 (class 1259 OID 90402)
-- Name: v_ciclo_vida_cotizaciones; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_ciclo_vida_cotizaciones AS
 WITH primera_transicion AS (
         SELECT DISTINCT ON (transicion_estado_cotizacion.id_cotizacion) transicion_estado_cotizacion.id_cotizacion,
            transicion_estado_cotizacion.fecha_transicion AS fecha_inicio
           FROM public.transicion_estado_cotizacion
          ORDER BY transicion_estado_cotizacion.id_cotizacion, transicion_estado_cotizacion.fecha_transicion
        ), ultima_transicion AS (
         SELECT DISTINCT ON (transicion_estado_cotizacion.id_cotizacion) transicion_estado_cotizacion.id_cotizacion,
            transicion_estado_cotizacion.fecha_transicion AS fecha_final,
            transicion_estado_cotizacion.estado_nuevo_id,
            transicion_estado_cotizacion.valor_estimado
           FROM public.transicion_estado_cotizacion
          ORDER BY transicion_estado_cotizacion.id_cotizacion, transicion_estado_cotizacion.fecha_transicion DESC
        )
 SELECT c.numero AS numero_cotizacion,
    cl.razon_social AS cliente,
    (((u.nombre)::text || ' '::text) || (u.apellidos)::text) AS asesor,
    pt.fecha_inicio,
    ut.fecha_final,
    EXTRACT(days FROM (ut.fecha_final - pt.fecha_inicio)) AS dias_ciclo_total,
    ec.nombre AS estado_final,
    ec.es_exitoso,
    ut.valor_estimado,
    c.total_soles AS valor_final_cotizacion,
    c.porcentaje_margen_promedio AS margen_final
   FROM (((((public.cotizacion c
     JOIN public.cliente cl ON ((c.id_cliente = cl.id)))
     JOIN public.usuario u ON ((c.id_asesor_ventas = u.id)))
     JOIN primera_transicion pt ON ((pt.id_cotizacion = c.id)))
     JOIN ultima_transicion ut ON ((ut.id_cotizacion = c.id)))
     JOIN public.estado_cotizacion ec ON ((ut.estado_nuevo_id = ec.id)))
  WHERE (c.activo = true)
  ORDER BY pt.fecha_inicio DESC;


ALTER VIEW public.v_ciclo_vida_cotizaciones OWNER TO postgres;

--
-- TOC entry 491 (class 1259 OID 68143)
-- Name: v_cobranza_pendiente; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_cobranza_pendiente AS
 SELECT c.numero_documento,
    cl.razon_social AS cliente,
    c.fecha_vencimiento,
    c.saldo_pendiente,
        CASE
            WHEN (c.fecha_vencimiento < CURRENT_DATE) THEN (CURRENT_DATE - c.fecha_vencimiento)
            ELSE 0
        END AS dias_vencido
   FROM (public.cuenta_por_cobrar c
     JOIN public.cliente cl ON ((cl.id = c.id_cliente)))
  WHERE (((c.estado)::text <> 'PAGADO'::text) AND (c.saldo_pendiente > (0)::numeric))
  ORDER BY c.fecha_vencimiento;


ALTER VIEW public.v_cobranza_pendiente OWNER TO postgres;

--
-- TOC entry 489 (class 1259 OID 68118)
-- Name: v_historial_precios_detallado; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_historial_precios_detallado AS
 SELECT hp.id,
    hp.sku,
    p.sku_producto AS codigo,
    p.nombre AS descripcion,
    hp.tipo_precio,
    hp.precio_anterior,
    hp.precio_nuevo,
    hp.porcentaje_cambio,
    m.codigo AS codigo_moneda,
    m.simbolo AS simbolo_moneda,
    hp.tipo_cambio_usado,
    hp.razon_cambio,
    hp.contexto_evento,
    hp.referencia_cotizacion,
    c.numero AS numero_cotizacion,
    cl.razon_social AS cliente,
    hp.factor_aplicado,
    hp.fecha_cambio,
    COALESCE((((u.nombre)::text || ' '::text) || (u.apellidos)::text), 'Sistema'::text) AS usuario_responsable
   FROM (((((public.historial_precios hp
     LEFT JOIN public.producto p ON ((p.sku = hp.sku)))
     LEFT JOIN public.moneda m ON ((m.id = hp.id_moneda)))
     LEFT JOIN public.cotizacion c ON ((c.id = hp.referencia_cotizacion)))
     LEFT JOIN public.cliente cl ON ((cl.id = c.id_cliente)))
     LEFT JOIN public.usuario u ON ((u.id = hp.usuario_responsable)))
  ORDER BY hp.fecha_cambio DESC;


ALTER VIEW public.v_historial_precios_detallado OWNER TO postgres;

--
-- TOC entry 504 (class 1259 OID 90392)
-- Name: v_performance_asesores_embudo; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_performance_asesores_embudo AS
 SELECT (((u.nombre)::text || ' '::text) || (u.apellidos)::text) AS asesor_nombre,
    count(DISTINCT t.id_cotizacion) AS cotizaciones_gestionadas,
    count(
        CASE
            WHEN (ec.es_exitoso = true) THEN 1
            ELSE NULL::integer
        END) AS cotizaciones_ganadas,
    count(
        CASE
            WHEN ((ec.codigo)::text = 'PERDIDO'::text) THEN 1
            ELSE NULL::integer
        END) AS cotizaciones_perdidas,
    round((((count(
        CASE
            WHEN (ec.es_exitoso = true) THEN 1
            ELSE NULL::integer
        END))::numeric * 100.0) / (NULLIF(count(DISTINCT t.id_cotizacion), 0))::numeric), 2) AS tasa_conversion_porcentaje,
    sum(
        CASE
            WHEN (ec.es_exitoso = true) THEN t.valor_estimado
            ELSE (0)::numeric
        END) AS valor_total_ganado,
    avg(
        CASE
            WHEN (ec.es_exitoso = true) THEN t.valor_estimado
            ELSE NULL::numeric
        END) AS ticket_promedio_ganado,
    avg(t.dias_en_estado_anterior) AS dias_promedio_por_estado
   FROM ((public.transicion_estado_cotizacion t
     JOIN public.usuario u ON ((t.usuario_responsable = u.id)))
     JOIN public.estado_cotizacion ec ON ((t.estado_nuevo_id = ec.id)))
  WHERE (t.fecha_transicion >= (now() - '3 mons'::interval))
  GROUP BY u.id, u.nombre, u.apellidos
  ORDER BY (round((((count(
        CASE
            WHEN (ec.es_exitoso = true) THEN 1
            ELSE NULL::integer
        END))::numeric * 100.0) / (NULLIF(count(DISTINCT t.id_cotizacion), 0))::numeric), 2)) DESC;


ALTER VIEW public.v_performance_asesores_embudo OWNER TO postgres;

--
-- TOC entry 490 (class 1259 OID 68128)
-- Name: v_pipeline_crm; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_pipeline_crm AS
 SELECT e.nombre AS etapa,
    e.orden_secuencial,
    e.color_hex,
    count(o.id) AS total_oportunidades,
    sum(o.valor_estimado) AS valor_total_pipeline,
    avg(o.probabilidad) AS probabilidad_promedio,
    avg(o.dias_en_pipeline) AS dias_promedio_pipeline,
    (((u.nombre)::text || ' '::text) || (u.apellidos)::text) AS asesor,
    count(
        CASE
            WHEN (o.fecha_creacion >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone)) THEN 1
            ELSE NULL::integer
        END) AS oportunidades_mes_actual,
    sum(
        CASE
            WHEN (o.fecha_creacion >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone)) THEN o.valor_estimado
            ELSE (0)::numeric
        END) AS valor_mes_actual
   FROM ((public.oportunidad o
     JOIN public.crm_etapa e ON ((e.id = o.id_etapa)))
     JOIN public.usuario u ON ((u.id = o.id_asesor)))
  WHERE ((o.estado)::text = 'ACTIVA'::text)
  GROUP BY e.id, e.nombre, e.orden_secuencial, e.color_hex, u.id, u.nombre, u.apellidos
  ORDER BY e.orden_secuencial, (sum(o.valor_estimado)) DESC;


ALTER VIEW public.v_pipeline_crm OWNER TO postgres;

--
-- TOC entry 516 (class 1259 OID 106318)
-- Name: v_producto_compatibilidad; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_producto_compatibilidad AS
 SELECT sku,
    sku_producto,
    cod_producto_marca,
    nombre,
    descripcion_corta,
    descripcion_detallada,
    especificaciones_tecnicas,
    aplicaciones,
    material,
    origen,
    id_categoria,
    id_marca,
    id_unidad,
    id_disponibilidad,
    peso_kg,
    dimensiones,
    volumen_m3,
    precio_referencia,
    id_moneda_referencia,
    margen_minimo,
    margen_sugerido,
    costo_proveedor,
    id_moneda_costo,
    ultimo_tipo_cambio,
    public.get_precio_principal(sku) AS precio_venta,
    public.get_margen_principal(sku) AS margen_aplicado,
    1 AS id_moneda_venta,
    id_proveedor_principal,
    requiere_stock,
    stock_minimo,
    punto_reorden,
    codigo_arancelario,
    es_importado,
    tiempo_importacion_dias,
    imagen_principal_url,
    galeria_imagenes_urls,
    seo_title,
    seo_description,
    seo_keywords,
    seo_slug,
    meta_robots,
    canonical_url,
    structured_data,
    seo_score,
    seo_optimizado,
    tags,
    es_destacado,
    es_novedad,
    es_promocion,
    activo,
    visible_web,
    requiere_aprobacion,
    fecha_creacion,
    fecha_actualizacion,
    creado_por,
    actualizado_por
   FROM public.producto p;


ALTER VIEW public.v_producto_compatibilidad OWNER TO postgres;

--
-- TOC entry 492 (class 1259 OID 68148)
-- Name: v_solicitudes_pendientes; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_solicitudes_pendientes AS
 SELECT s.codigo,
    s.nombre_completo,
    s.correo,
    s.canal_origen,
    s.fecha_solicitud,
    s.fecha_limite_respuesta,
        CASE
            WHEN (s.fecha_limite_respuesta < now()) THEN 'VENCIDA'::text
            WHEN (s.fecha_limite_respuesta < (now() + '02:00:00'::interval)) THEN 'URGENTE'::text
            ELSE 'NORMAL'::text
        END AS urgencia,
    COALESCE((((u.nombre)::text || ' '::text) || (u.apellidos)::text), 'Sin asignar'::text) AS asesor_asignado,
    s.estado,
    s.total_archivos
   FROM (public.solicitud_cotizacion s
     LEFT JOIN public.usuario u ON ((u.id = s.id_asesor_asignado)))
  WHERE ((s.estado)::text = ANY ((ARRAY['NUEVA'::character varying, 'ASIGNADA'::character varying, 'EN_PROCESO'::character varying])::text[]))
  ORDER BY s.fecha_limite_respuesta;


ALTER VIEW public.v_solicitudes_pendientes OWNER TO postgres;

--
-- TOC entry 503 (class 1259 OID 90387)
-- Name: v_transiciones_por_estado; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_transiciones_por_estado AS
 SELECT ec_origen.nombre AS estado_origen,
    ec_destino.nombre AS estado_destino,
    count(*) AS total_transiciones,
    avg(t.dias_en_estado_anterior) AS dias_promedio_en_estado,
    avg(t.valor_estimado) AS valor_promedio,
    count(
        CASE
            WHEN (t.fecha_transicion >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone)) THEN 1
            ELSE NULL::integer
        END) AS transiciones_mes_actual
   FROM ((public.transicion_estado_cotizacion t
     LEFT JOIN public.estado_cotizacion ec_origen ON ((t.estado_anterior_id = ec_origen.id)))
     JOIN public.estado_cotizacion ec_destino ON ((t.estado_nuevo_id = ec_destino.id)))
  WHERE (t.fecha_transicion >= (now() - '6 mons'::interval))
  GROUP BY ec_origen.id, ec_origen.nombre, ec_destino.id, ec_destino.nombre
  ORDER BY (count(*)) DESC;


ALTER VIEW public.v_transiciones_por_estado OWNER TO postgres;

--
-- TOC entry 411 (class 1259 OID 66798)
-- Name: vehicle_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.vehicle_types ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vehicle_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 383 (class 1259 OID 17255)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- TOC entry 507 (class 1259 OID 97132)
-- Name: messages_2025_09_22; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_09_22 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_09_22 OWNER TO supabase_admin;

--
-- TOC entry 508 (class 1259 OID 102118)
-- Name: messages_2025_09_23; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_09_23 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_09_23 OWNER TO supabase_admin;

--
-- TOC entry 509 (class 1259 OID 102129)
-- Name: messages_2025_09_24; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_09_24 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_09_24 OWNER TO supabase_admin;

--
-- TOC entry 510 (class 1259 OID 102140)
-- Name: messages_2025_09_25; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_09_25 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_09_25 OWNER TO supabase_admin;

--
-- TOC entry 511 (class 1259 OID 102252)
-- Name: messages_2025_09_26; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_09_26 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_09_26 OWNER TO supabase_admin;

--
-- TOC entry 512 (class 1259 OID 102367)
-- Name: messages_2025_09_27; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_09_27 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_09_27 OWNER TO supabase_admin;

--
-- TOC entry 513 (class 1259 OID 105112)
-- Name: messages_2025_09_28; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2025_09_28 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2025_09_28 OWNER TO supabase_admin;

--
-- TOC entry 375 (class 1259 OID 17003)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- TOC entry 380 (class 1259 OID 17109)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- TOC entry 379 (class 1259 OID 17108)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 358 (class 1259 OID 16546)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- TOC entry 6014 (class 0 OID 0)
-- Dependencies: 358
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 494 (class 1259 OID 68466)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- TOC entry 360 (class 1259 OID 16588)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- TOC entry 359 (class 1259 OID 16561)
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- TOC entry 6017 (class 0 OID 0)
-- Dependencies: 359
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 493 (class 1259 OID 68421)
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- TOC entry 376 (class 1259 OID 17040)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- TOC entry 377 (class 1259 OID 17054)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- TOC entry 4217 (class 0 OID 0)
-- Name: messages_2025_09_22; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_22 FOR VALUES FROM ('2025-09-22 00:00:00') TO ('2025-09-23 00:00:00');


--
-- TOC entry 4218 (class 0 OID 0)
-- Name: messages_2025_09_23; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_23 FOR VALUES FROM ('2025-09-23 00:00:00') TO ('2025-09-24 00:00:00');


--
-- TOC entry 4219 (class 0 OID 0)
-- Name: messages_2025_09_24; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_24 FOR VALUES FROM ('2025-09-24 00:00:00') TO ('2025-09-25 00:00:00');


--
-- TOC entry 4220 (class 0 OID 0)
-- Name: messages_2025_09_25; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_25 FOR VALUES FROM ('2025-09-25 00:00:00') TO ('2025-09-26 00:00:00');


--
-- TOC entry 4221 (class 0 OID 0)
-- Name: messages_2025_09_26; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_26 FOR VALUES FROM ('2025-09-26 00:00:00') TO ('2025-09-27 00:00:00');


--
-- TOC entry 4222 (class 0 OID 0)
-- Name: messages_2025_09_27; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_27 FOR VALUES FROM ('2025-09-27 00:00:00') TO ('2025-09-28 00:00:00');


--
-- TOC entry 4223 (class 0 OID 0)
-- Name: messages_2025_09_28; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_28 FOR VALUES FROM ('2025-09-28 00:00:00') TO ('2025-09-29 00:00:00');


--
-- TOC entry 4233 (class 2604 OID 16510)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4577 (class 2604 OID 67965)
-- Name: carrito_compra id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_compra ALTER COLUMN id SET DEFAULT nextval('public.carrito_compra_id_seq'::regclass);


--
-- TOC entry 4313 (class 2604 OID 66780)
-- Name: categoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);


--
-- TOC entry 4277 (class 2604 OID 66656)
-- Name: ciudad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad ALTER COLUMN id SET DEFAULT nextval('public.ciudad_id_seq'::regclass);


--
-- TOC entry 4336 (class 2604 OID 66867)
-- Name: cliente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id SET DEFAULT nextval('public.cliente_id_seq'::regclass);


--
-- TOC entry 4446 (class 2604 OID 67326)
-- Name: comunicacion_solicitud id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comunicacion_solicitud ALTER COLUMN id SET DEFAULT nextval('public.comunicacion_solicitud_id_seq'::regclass);


--
-- TOC entry 4304 (class 2604 OID 66746)
-- Name: condiciones_comerciales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condiciones_comerciales ALTER COLUMN id SET DEFAULT nextval('public.condiciones_comerciales_id_seq'::regclass);


--
-- TOC entry 4367 (class 2604 OID 66997)
-- Name: configuracion_fe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_fe ALTER COLUMN id SET DEFAULT nextval('public.configuracion_fe_id_seq'::regclass);


--
-- TOC entry 4588 (class 2604 OID 68039)
-- Name: costos_operativos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costos_operativos ALTER COLUMN id SET DEFAULT nextval('public.costos_operativos_id_seq'::regclass);


--
-- TOC entry 4483 (class 2604 OID 67530)
-- Name: cotizacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion ALTER COLUMN id SET DEFAULT nextval('public.cotizacion_id_seq'::regclass);


--
-- TOC entry 4505 (class 2604 OID 67599)
-- Name: cotizacion_detalle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_detalle ALTER COLUMN id SET DEFAULT nextval('public.cotizacion_detalle_id_seq'::regclass);


--
-- TOC entry 4470 (class 2604 OID 67443)
-- Name: crm_actividad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_actividad ALTER COLUMN id SET DEFAULT nextval('public.crm_actividad_id_seq'::regclass);


--
-- TOC entry 4322 (class 2604 OID 66815)
-- Name: crm_etapa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_etapa ALTER COLUMN id SET DEFAULT nextval('public.crm_etapa_id_seq'::regclass);


--
-- TOC entry 4479 (class 2604 OID 67493)
-- Name: crm_nota id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_nota ALTER COLUMN id SET DEFAULT nextval('public.crm_nota_id_seq'::regclass);


--
-- TOC entry 4570 (class 2604 OID 67939)
-- Name: crowdlending_operacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crowdlending_operacion ALTER COLUMN id SET DEFAULT nextval('public.crowdlending_operacion_id_seq'::regclass);


--
-- TOC entry 4552 (class 2604 OID 67831)
-- Name: cuenta_por_cobrar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_por_cobrar ALTER COLUMN id SET DEFAULT nextval('public.cuenta_por_cobrar_id_seq'::regclass);


--
-- TOC entry 4456 (class 2604 OID 67372)
-- Name: detalle_solicitud_cotizacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_solicitud_cotizacion ALTER COLUMN id SET DEFAULT nextval('public.detalle_solicitud_cotizacion_id_seq'::regclass);


--
-- TOC entry 4423 (class 2604 OID 67246)
-- Name: direccion_cliente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion_cliente ALTER COLUMN id SET DEFAULT nextval('public.direccion_cliente_id_seq'::regclass);


--
-- TOC entry 4286 (class 2604 OID 66704)
-- Name: disponibilidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidad ALTER COLUMN id SET DEFAULT nextval('public.disponibilidad_id_seq'::regclass);


--
-- TOC entry 4341 (class 2604 OID 66894)
-- Name: empresa_emisora id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_emisora ALTER COLUMN id SET DEFAULT nextval('public.empresa_emisora_id_seq'::regclass);


--
-- TOC entry 4603 (class 2604 OID 86645)
-- Name: estado_cotizacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_cotizacion ALTER COLUMN id SET DEFAULT nextval('public.estado_cotizacion_id_seq'::regclass);


--
-- TOC entry 4564 (class 2604 OID 67921)
-- Name: factoring_operacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factoring_operacion ALTER COLUMN id SET DEFAULT nextval('public.factoring_operacion_id_seq'::regclass);


--
-- TOC entry 4532 (class 2604 OID 67746)
-- Name: factura id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura ALTER COLUMN id SET DEFAULT nextval('public.factura_id_seq'::regclass);


--
-- TOC entry 4545 (class 2604 OID 67805)
-- Name: factura_detalle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_detalle ALTER COLUMN id SET DEFAULT nextval('public.factura_detalle_id_seq'::regclass);


--
-- TOC entry 4298 (class 2604 OID 66732)
-- Name: forma_pago id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_pago ALTER COLUMN id SET DEFAULT nextval('public.forma_pago_id_seq'::regclass);


--
-- TOC entry 4582 (class 2604 OID 67994)
-- Name: historial_precios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_precios ALTER COLUMN id SET DEFAULT nextval('public.historial_precios_id_seq'::regclass);


--
-- TOC entry 4592 (class 2604 OID 68061)
-- Name: inversion_categoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inversion_categoria ALTER COLUMN id SET DEFAULT nextval('public.inversion_categoria_id_seq'::regclass);


--
-- TOC entry 4316 (class 2604 OID 66789)
-- Name: marca id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marca ALTER COLUMN id SET DEFAULT nextval('public.marca_id_seq'::regclass);


--
-- TOC entry 4267 (class 2604 OID 66618)
-- Name: moneda id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moneda ALTER COLUMN id SET DEFAULT nextval('public.moneda_id_seq'::regclass);


--
-- TOC entry 4460 (class 2604 OID 67397)
-- Name: oportunidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oportunidad ALTER COLUMN id SET DEFAULT nextval('public.oportunidad_id_seq'::regclass);


--
-- TOC entry 4559 (class 2604 OID 67875)
-- Name: pago_recibido id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_recibido ALTER COLUMN id SET DEFAULT nextval('public.pago_recibido_id_seq'::regclass);


--
-- TOC entry 4274 (class 2604 OID 66634)
-- Name: pais id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais ALTER COLUMN id SET DEFAULT nextval('public.pais_id_seq'::regclass);


--
-- TOC entry 4513 (class 2604 OID 67643)
-- Name: pedido id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido ALTER COLUMN id SET DEFAULT nextval('public.pedido_id_seq'::regclass);


--
-- TOC entry 4525 (class 2604 OID 67713)
-- Name: pedido_detalle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_detalle ALTER COLUMN id SET DEFAULT nextval('public.pedido_detalle_id_seq'::regclass);


--
-- TOC entry 4454 (class 2604 OID 67362)
-- Name: procesamiento_archivo_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procesamiento_archivo_log ALTER COLUMN id SET DEFAULT nextval('public.procesamiento_archivo_log_id_seq'::regclass);


--
-- TOC entry 4384 (class 2604 OID 67077)
-- Name: producto sku; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN sku SET DEFAULT nextval('public.producto_sku_seq'::regclass);


--
-- TOC entry 4650 (class 2604 OID 106231)
-- Name: producto_precio_moneda id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_precio_moneda ALTER COLUMN id SET DEFAULT nextval('public.producto_precio_moneda_id_seq'::regclass);


--
-- TOC entry 4403 (class 2604 OID 67158)
-- Name: producto_proveedor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_proveedor ALTER COLUMN id SET DEFAULT nextval('public.producto_proveedor_id_seq'::regclass);


--
-- TOC entry 4412 (class 2604 OID 67191)
-- Name: promocion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion ALTER COLUMN id SET DEFAULT nextval('public.promocion_id_seq'::regclass);


--
-- TOC entry 4418 (class 2604 OID 67211)
-- Name: promocion_descuento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion_descuento ALTER COLUMN id SET DEFAULT nextval('public.promocion_descuento_id_seq'::regclass);


--
-- TOC entry 4421 (class 2604 OID 67227)
-- Name: promocion_uso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion_uso ALTER COLUMN id SET DEFAULT nextval('public.promocion_uso_id_seq'::regclass);


--
-- TOC entry 4344 (class 2604 OID 66912)
-- Name: proveedor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor ALTER COLUMN id SET DEFAULT nextval('public.proveedor_id_seq'::regclass);


--
-- TOC entry 4282 (class 2604 OID 66685)
-- Name: rol id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN id SET DEFAULT nextval('public.rol_id_seq'::regclass);


--
-- TOC entry 4310 (class 2604 OID 66767)
-- Name: rubro id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rubro ALTER COLUMN id SET DEFAULT nextval('public.rubro_id_seq'::regclass);


--
-- TOC entry 4430 (class 2604 OID 67281)
-- Name: solicitud_cotizacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cotizacion ALTER COLUMN id SET DEFAULT nextval('public.solicitud_cotizacion_id_seq'::regclass);


--
-- TOC entry 4285 (class 2604 OID 66696)
-- Name: tipo_cliente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cliente ALTER COLUMN id SET DEFAULT nextval('public.tipo_cliente_id_seq1'::regclass);


--
-- TOC entry 4611 (class 2604 OID 89064)
-- Name: tipo_contacto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_contacto ALTER COLUMN id SET DEFAULT nextval('public.tipo_contacto_id_seq'::regclass);


--
-- TOC entry 4616 (class 2604 OID 90347)
-- Name: transicion_estado_cotizacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transicion_estado_cotizacion ALTER COLUMN id SET DEFAULT nextval('public.transicion_estado_cotizacion_id_seq'::regclass);


--
-- TOC entry 4293 (class 2604 OID 66719)
-- Name: unidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidad ALTER COLUMN id SET DEFAULT nextval('public.unidad_id_seq'::regclass);


--
-- TOC entry 4333 (class 2604 OID 66841)
-- Name: usuario_rol id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol ALTER COLUMN id SET DEFAULT nextval('public.usuario_rol_id_seq'::regclass);


--
-- TOC entry 5514 (class 0 OID 16525)
-- Dependencies: 356
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bf8467f5-61c5-4000-8e2c-08337f829878', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"rpena@inxora.com","user_id":"82df97ec-0c85-495e-b673-31c03757603b","user_phone":""}}', '2025-08-26 15:25:21.252052+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3368f472-3d66-4463-8c3a-d765682c40b4', '{"action":"login","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-26 19:22:04.160695+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '27beff07-455d-456b-9810-b267701e5ee0', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 20:20:21.837693+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5bf49738-643d-4c6e-8826-2d39353d88de', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 20:20:21.848614+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cf7a5d83-265f-4ab3-8f0e-3635418c145b', '{"action":"logout","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"account"}', '2025-08-26 20:50:57.449299+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9c285837-fbd1-42fc-9073-527e3bb54dab', '{"action":"login","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-26 20:52:09.881021+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bcd9cab1-10e7-4f1e-8770-ada807ae6f92', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 21:51:18.506458+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3fc1f562-8204-4546-8993-7e31cc661718', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 21:51:18.518018+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '78a762ee-1cee-4358-b2dc-f882656ebf3b', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-26 21:51:18.565272+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1dfb4e0f-d095-4793-980c-812ab205e3f2', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 15:10:01.081889+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '308b36d7-eff8-4248-8196-9bd628b15be4', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 15:10:01.090576+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '40623c48-c0c5-4c2a-92ae-f2237244f6e4', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 16:42:55.327272+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '44943ffc-6776-455e-8939-876c68b7d205', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 16:42:55.334625+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f05b9d3b-5a90-4d21-aaff-172ea44ed4ee', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 17:51:03.425308+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f44a568c-cf7e-4cb6-9ce5-a5dfddae5052', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 17:51:03.429063+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8f4c1221-7129-42de-a3d1-4ed3dca94155', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 19:34:29.870012+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3206459a-4eb7-49d1-bcf9-efea5172e12d', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-27 19:34:29.880456+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f4df2709-7bbe-474b-b3b8-1c76a9885667', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 13:42:43.869591+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '83647c03-ec3e-4ee7-9053-4e5c53d91d85', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 13:42:43.896774+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '92a8ad05-15d9-48c3-a7ed-a2f2e3c6517a', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 14:45:00.290201+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd8832514-9e45-4454-b7b6-e4fd29257e5a', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 14:45:00.298801+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '167ebdda-eda9-443a-bccf-11865c753a71', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 14:45:00.352436+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c4adc0d7-5087-4a84-a33f-83c8a0c61f99', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 15:50:22.897489+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '39c42c0e-ae2c-464d-ac74-c577bf47fc94', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 15:50:22.912813+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c8fe0603-4fdd-48d2-9f29-8500d5a137c7', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 16:52:33.746941+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7af0af09-89ed-4b2f-a3c0-65f2388525b5', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 16:52:33.754211+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8974b362-f6c9-4e8c-a154-5cf419131977', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 16:52:33.79804+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fc501a5e-6c55-4e7d-a005-90d40512dba2', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 18:16:54.25778+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9a541261-c237-4806-8f63-2dbb23fa5240', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 18:16:54.269145+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b1986e9d-e352-4429-82c7-28df64e244ca', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 19:32:18.739047+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '38dbd533-7283-4968-a447-112c665b53f2', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 19:32:18.764052+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '95a5193b-ee10-4320-acf8-63eeee9e7c11', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 20:36:43.870277+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9fa6cad7-b417-4f3d-9b44-0f05a887a040', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 20:36:43.891916+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '98938d38-207c-4e40-82ed-c362533db97d', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 21:36:50.849474+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '084dbf3d-d6d5-45fb-86c0-c4d4a532ad69', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 21:36:50.882033+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '389188c7-105d-4f40-94b3-68328535e0ee', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 22:45:55.942652+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '274cbdea-47f7-4755-995c-b9d904ba0977', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 22:45:55.96428+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '61fd0663-e852-4d48-b33d-e9ff863d4447', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 22:45:56.024229+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '89b817e2-3ff5-4f31-be53-acd81a0c95a4', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 23:44:23.207446+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0095ffdb-b09e-486d-ba49-a63a2d355638', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-29 23:44:23.22818+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b3bb3efd-60b9-4e46-b43e-d36d2915e105', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 00:42:56.243403+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3fc39a24-b5f3-4f30-a18c-a41272c9799f', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-08-30 00:42:56.265319+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e9ef6995-18aa-452b-a7e3-6637add4a7a5', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 13:36:00.434353+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a62da79c-73ca-41b8-83d7-fddf07055b05', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 13:36:00.465323+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '77a7468c-8cb7-480f-a27d-4d18092b4c40', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 14:35:50.122138+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '588a5460-2a80-48e2-b4f9-bbd352e1e359', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 14:35:50.129217+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fd93e1c2-a999-4ab5-a437-96acd7b5eabd', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 15:44:41.810528+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ad998384-1c9f-4f90-8f99-351245d6be19', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 15:44:41.835176+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e4d70616-0702-46c8-97d6-50560637c755', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 16:53:37.656248+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c0153df9-7570-43b8-bf8d-0fcc9ddd1b0e', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 16:53:37.67215+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fb610eed-41dc-4344-8efa-a5b717b10545', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 17:51:48.374748+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '21471ba3-9af4-4b96-9144-4635bf9028c8', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 17:51:48.395244+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'eb8cc8a5-4016-432f-b135-2977073adc00', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 19:25:40.043342+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7b1ce282-41e7-4e27-9f48-8967f126d5bd', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 19:25:40.055012+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'acceeaba-f71d-437c-a226-a7b7a9c54806', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 20:23:40.182753+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fb6907b1-1eb8-46b9-b799-944ef67eef9b', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 20:23:40.19036+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0b4149cd-8e0d-4f60-86d2-01bef2b8e897', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 20:23:40.233019+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c035c037-4a46-4b2f-a339-5915854c5d49', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 21:22:09.222052+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9434fc76-35c3-45c6-85d6-c1ef510c9392', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 21:22:09.236294+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c618f1d1-91ff-42ca-b7f1-86f18f8ff3b2', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-01 21:22:09.292178+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'eba935d2-a8cb-4e6f-be06-ba1faf1be292', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 13:35:54.093161+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '985e79bc-71b9-4c7f-9f91-e35ae942bed2', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 13:35:54.125415+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5e0be2c0-58f5-4a9d-97bd-fb5aa2b531c8', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 14:34:52.557377+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'dd253618-bfc7-4d39-b9b4-7983c241f573', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 14:34:52.571768+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'dcfa1c15-c834-4e5c-a287-a1ee54ae2dc3', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 15:35:33.390683+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '492ec10d-0d1f-4253-9409-f3ac42007095', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 15:35:33.412011+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd4b44b9c-aabb-49a5-ab03-7421e11adb0b', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 16:41:41.659095+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '45c0b414-e95b-4c9d-9bf9-6649c490d700', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 16:41:41.672758+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9502ddc4-3a4d-4a5d-b6fd-6cc025f6aa3f', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 17:40:59.008008+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'aacf41e7-44e7-42c2-a47f-0f73c3f4a4fb', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 17:40:59.014119+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ed81d001-6650-4429-8482-a69943a5d533', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 19:41:55.46695+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a19f99ba-0401-41f4-85d2-24d654953dcb', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 19:41:55.497869+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '391c7abc-f171-4c62-a4e7-fb05ecf563a3', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 20:40:22.340246+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '23a9b398-1911-4981-9293-1121f4faa7da', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 20:40:22.348561+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bfae261f-4341-4f0e-af93-1b3aeacd019e', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 21:53:18.863376+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '45c67437-a92c-4045-87ac-615f4f5b7b0c', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-02 21:53:18.895176+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '07450302-886c-4433-b709-4a69f67ce9b0', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 13:19:29.556286+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '34c8f167-a67f-4ff9-8c02-f08848926674', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 13:19:29.580227+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fdfc12ca-72b8-457b-b49e-3bb547d6db10', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 14:34:35.924513+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0f4bb32e-570d-4dcf-be2a-67b8337e6f90', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 14:34:35.935062+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f4a5bee1-2de7-44bd-ad5c-f61d100813e7', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 15:59:57.760004+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b73b0767-42b4-4996-b386-0a0de7e8bd8c', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 15:59:57.768391+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '40e5b95a-5e9d-40bd-a128-03092333231a', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 16:58:27.959217+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5ce55d21-b329-4e60-8024-b648a5063c73', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 16:58:27.969042+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bfc57651-565f-40fa-ad6c-51c1614e203c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 17:56:55.871187+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f7f39e83-18e5-46d8-9b3a-ad0a6b6b7560', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 17:56:55.897663+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '386ef228-971d-45cf-a7cd-48a332fa66cd', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 19:13:25.826836+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '33a760f5-1dec-40f4-84ec-5d5bcbbbe0f1', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 19:13:25.848278+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c8de7660-27e0-47c5-9fe7-a7ad21e56941', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 20:13:36.01676+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'dda2915b-19c0-428a-949a-0a88815cbf8a', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 20:13:36.032287+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ad0e09b4-d45e-4cd3-a1a8-761b9f5e3928', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 21:22:37.461445+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4d4879da-b957-4c6e-99b0-b28c069842d9', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-03 21:22:37.473464+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7ddfb4a4-56b7-47c7-9b8e-911c57171436', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 13:27:35.025594+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9fa15e02-286c-4113-b0a2-103340041821', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 13:27:35.058029+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c14392d9-c4b1-4892-8140-5e1ee3a35b41', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 14:25:45.054497+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '009e6c72-056f-4b46-9f6d-bbbab38e0437', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 14:25:45.070194+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9009d5fa-e262-40fe-919a-a778cd481281', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 15:47:28.450715+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e6eed39d-0325-43ad-ba65-985888e61e42', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 15:47:28.474426+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9f03fe26-2e1a-46f2-a100-fcb87e4eefbe', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 16:45:58.571693+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2d0abb61-cd73-4ad9-90b0-b83a5129ffe8', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 16:45:58.590469+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '99b85e9e-262e-4f63-a152-1c94cec97a86', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 16:45:58.645876+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '20b7cd16-bf5c-44b2-8f00-328a6daee188', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 17:44:23.723474+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5f4a864a-b7c5-4a76-8113-6dc190f2fc0a', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 17:44:23.742341+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '002a8fa8-89eb-48b5-a117-d597fc4aa2a7', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 17:44:23.771715+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ed5dbb24-aa54-4167-8851-28a0757e3a88', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 18:42:30.01342+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9033c12e-8740-4d07-aee8-b4346c881a19', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 18:42:30.028401+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ae00e817-6e6f-4fb5-8b6c-951a59150e74', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 18:42:30.091147+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '999c33cf-ba94-4900-9588-72159d8acaa0', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 19:41:15.250877+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5e930e5e-4688-4225-acd4-9b2e32791dd3', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 19:41:15.275091+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '60a454e4-a947-45d3-a466-283015943bb1', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 20:42:35.209318+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '88a4eaa3-2c61-441d-92a5-7b5a1eb185fd', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 20:42:35.237405+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b045b8a9-7aeb-4a0d-89f6-220787bca642', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 21:40:42.97786+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '640342ad-79e1-4b3a-a0ae-5f6782188f2c', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 21:40:42.989289+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cd3b6ed9-c98b-4572-91f5-b9c8d7772703', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 13:31:27.833454+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5db096f0-6907-4859-9c80-7bfe65901c14', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 13:31:27.86361+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '06f7fa4c-957e-4479-a91d-54680c602873', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 14:30:18.734327+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '25481989-7814-4275-b48e-7510510bd7ed', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 14:30:18.752838+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f6830e28-0574-4170-a1e9-70acacacf51a', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 15:28:26.637881+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b9077337-f75a-43f1-bb54-45b907447cfc', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 15:28:26.649399+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '589403a8-fd56-4c8b-a0ee-6aa5991f1d27', '{"action":"login","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-05 16:09:35.937569+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '134b217a-8ddb-4335-8b4e-88df15ee6378', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 17:07:49.814686+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5845e778-afb6-4bfc-b29d-384bd7326f6e', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 17:07:49.831497+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2084eafc-e7ff-4fca-82ef-97b74ebd4cf6', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 18:47:54.857566+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5dd20bfa-c4f7-458d-adc4-731cbba222b5', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 18:47:54.887076+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bd10b0c2-fc36-46d3-b1cb-9e04435041fb', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 19:46:13.350799+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '68bc3efc-e6be-45fc-a290-e92ef7900673', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 19:46:13.369352+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '48fc14e1-dd20-4f43-9fc3-3a03f3b4760c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 20:47:03.165521+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9e5325e2-8bbe-474e-aaa9-99e28cc48f71', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 20:47:03.173921+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '463c5923-4a96-40cb-be8a-812318f63cb8', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 20:47:03.226706+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a73fc5c4-02c4-40b1-86e6-72df8c382ad9', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 21:45:34.02444+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e696b852-baad-43c5-a330-6a9e4f735068', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-05 21:45:34.042966+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f55f1d58-b571-4752-9c10-2cb2a8cccb49', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 13:45:57.649064+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3893e0a2-ca36-44a3-868c-ed2d3e231478', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 13:45:57.673248+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '19d43904-6d24-4b1e-a945-c9067f3acde1', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 14:44:00.339606+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd68821d4-4238-424e-bf70-e50db45ec511', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 14:44:00.34725+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd461dc69-ddf0-425e-92f1-824f8406b484', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 15:50:21.115959+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ff5b54ec-4416-4f94-816b-997b63c44815', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 15:50:21.126855+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd7ecfda7-7303-4cb4-b242-29c3cedd26f7', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 16:48:26.476754+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '44e73578-da39-48b9-a20e-7dbd7acc92bb', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 16:48:26.491212+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e64496e1-25a5-468b-af32-53f3779f2fd0', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 17:46:47.513881+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '070a8807-e4df-400e-ae56-ea17c8b1aab3', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 17:46:47.530549+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6591138a-ceea-495e-b9c9-9f412f0023b6', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 19:24:29.100375+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2386b48a-c092-40bb-b991-de2350439b86', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 19:24:29.133006+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '993ed319-b889-41de-9b32-4e3d14a7185a', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 20:22:40.00774+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8ce0fc0b-c76a-4f94-9c76-d10de4e90dd0', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 20:22:40.035642+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3a09f941-347f-4e66-8697-3243f102786f', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 21:20:55.490489+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '72a0e13a-a438-425f-a8b4-460631a4fd82', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-08 21:20:55.503791+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0de0933a-48c8-4c01-8e6f-a6dbbac1a9b2', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 13:19:06.096678+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0ec34ded-f300-4e61-a3c3-df6820b627ba', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 13:19:06.126806+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8cbbb29c-31d8-471f-ba37-a7619674c7f7', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 14:17:31.52567+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '14ab40f0-c640-4d78-a017-a53de11ca47d', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 14:17:31.544904+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '273af88e-7002-46f2-8189-9a76820a53b4', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 15:31:08.928079+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '898ae5d9-bfd4-40b4-a17a-46e18746499e', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 15:31:08.938353+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '64f9fec0-cc04-444b-8810-6da0185a4682', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 16:30:32.733997+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b7907cd5-b795-465e-acec-4406b57b9652', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 16:30:32.741636+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '44c10179-74c2-428c-a5f5-c7b0e09cf9f4', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 17:33:14.643535+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '35a8fc53-d1ce-40d2-aebf-e383a2dc02e5', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 17:33:14.676526+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cebb7797-cf4e-485d-8dd5-00dc2b39f848', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 18:44:24.870705+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '79c63f34-0a32-4817-aff9-a3cda57e799f', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 18:44:24.896345+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3a93cc85-a4e7-4f00-b4d7-393b01579396', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 20:48:15.758412+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd889d5c7-cf15-4bb8-aec5-5e9cc60f5071', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-09 20:48:15.780223+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4d0b5948-f218-477e-a9f1-27356621a995', '{"action":"login","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-09 20:54:22.197112+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9ec8f9f9-4e36-4851-bb41-9e2caebf11d8', '{"action":"logout","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"account"}', '2025-09-09 21:00:24.688123+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e12d022a-23fd-4d61-a04c-ecb39189ef5f', '{"action":"login","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-09 21:50:42.310541+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6f1925d9-991f-4735-b646-7d634534bbf1', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 13:34:46.381635+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '183fc3aa-ad00-4c1c-bf96-9c3a819e85b9', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 13:34:46.406924+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bd53991b-a9a6-4fec-8356-e85d897bfb78', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 14:33:10.387056+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4f43ed95-da50-47b5-974e-96de6cd99efb', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 14:33:10.399671+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3b15b09d-5db3-4995-a5f9-723a1fde6a9c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 15:32:33.921835+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '27daf687-2b3d-4b71-a452-52bc6fc4e28b', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 15:32:33.94235+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2757d2c9-3b22-477f-954c-f81324e9e84c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 16:30:45.436142+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '26012d6a-66bc-480d-abf1-9ace2a7da939', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 16:30:45.455789+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '47051d08-b78b-4a93-9414-694ad9ce8c5f', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 17:39:00.511128+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ed7f958d-ac4c-4382-b5b0-43f245299d69', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 17:39:00.521169+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6fb244f9-c358-49ef-980f-78a6c0919004', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 19:44:41.168132+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1c230220-3ff7-4a26-8691-27dd6ebbc6f0', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 19:44:41.194117+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7c3f85cc-93ec-4a34-afe8-0d5739a668ae', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 21:18:51.089972+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '37a489be-15e3-481b-aa76-778ad57e60fd', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-10 21:18:51.10125+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fd60cc64-39e6-449a-97a0-93113a89d3cf', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"raponte@inxora.com","user_id":"36e6097c-3167-4a35-8d22-c5036418c0d5","user_phone":""}}', '2025-09-10 21:39:46.587976+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bfcc2d9b-3984-4e24-9d23-5b540efb46f7', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"dlatorre@inxora.com","user_id":"60bc1460-6cbf-48b0-937c-eb2322ca1cbc","user_phone":""}}', '2025-09-10 21:40:15.454173+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ebd0cfb9-8b2a-44da-b0c1-dde97cc87bea', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"jhuamani@inxora.com","user_id":"a5dbdcdd-081e-4103-81b8-c09a95c249fc","user_phone":""}}', '2025-09-10 21:40:48.99829+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0c897f33-ca79-4c02-82d8-02125b325e56', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"zvaras@inxora.com","user_id":"5ed36a9e-5329-4b84-a3f0-7e8b9a01be5b","user_phone":""}}', '2025-09-10 21:41:14.293435+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '64c9ac37-ea0b-4bc7-9eb8-73445c472ef1', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"nmantilla@inxora.com","user_id":"2c387ed4-e734-46d0-ad85-666fa04a6c69","user_phone":""}}', '2025-09-10 21:41:43.019409+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '22d95d8c-3f50-4670-9682-39a5e53a1274', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 13:21:52.517003+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f1f1667a-c3e8-4527-a1cc-b914a839b1e4', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 13:21:52.547923+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0a975ea3-ba1d-4f52-9aa7-f4f165803699', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 15:12:20.351425+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7ecfccfa-29fc-4f37-b309-95df439d9a7f', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 15:12:20.382476+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b39577da-2158-420e-8c24-99cbb97b5237', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 16:10:32.75586+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0ffea8f3-dda4-46a1-b997-12c14f2ad135', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 16:10:32.769587+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a5215fa8-9b26-4a2d-abce-9fce0ae3ffe4', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 17:08:50.333216+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '96ddbfa2-a11d-406d-b5e9-031507f472e6', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 17:08:50.343586+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a545004f-47a9-46d5-95aa-65462899c4cd', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 18:07:00.271477+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'aac8fb1d-03ab-45b6-93a9-9f77904dcb0c', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 18:07:00.297273+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3aba5470-d979-4e9e-937a-87b5a5eef8e7', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 19:48:33.915203+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '995e299e-05c3-486d-bab1-b41ba4cd84c3', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 19:48:33.942552+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '18f9a503-9d4c-4ee0-a7cc-0ab0c786452c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 20:46:43.584719+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '307178ee-1af9-4923-99a1-c637243b3d83', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 20:46:43.601413+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd6e04555-d825-46df-a70a-6c535dfa8faa', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 21:46:52.281773+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ce58be85-1385-412a-bd5b-9f4f62b09d64', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-11 21:46:52.291191+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8fc4cd45-b81f-423e-b03f-f9709b3480ce', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 13:21:17.591728+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '312d66a7-ea0d-4c01-8a07-5671f3f2d9e7', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 13:21:17.623771+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9a726b91-5ca2-4808-9b34-4c042d79d282', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 14:20:01.353834+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '63c46e18-e19c-4230-9b15-b3db6891b478', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 14:20:01.368298+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '85801977-945f-4801-913c-41376613e97c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 15:18:03.536138+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '400d3f26-f2d2-40f3-b3a3-4b76a18432d0', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 15:18:03.548666+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '61425be2-6e2a-4d05-9d29-61482a819146', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 16:16:08.214656+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '782008e6-aa2e-43cb-80b1-fe59ee231a2c', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 16:16:08.23249+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '42a9c22e-2bdd-4a1d-952a-65e936e49931', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 17:14:26.783595+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'db99de56-a231-48b9-bdb3-103427866275', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 17:14:26.793233+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '503a5367-7211-419f-b14a-6131d54d7321', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 18:12:44.24543+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e2f0098b-61a0-449d-9ede-8fafc9372eff', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 18:12:44.270691+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '741daf4a-bd81-4679-829c-dae62b1f8dff', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 19:17:12.378908+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4bccc84d-d878-480f-93de-fefccdcee807', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 19:17:12.386106+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '605bd545-29cb-4faa-a0db-8c609e331acf', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 20:16:25.935853+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5bd154f0-41d2-447a-ae9b-ea03afa619cc', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 20:16:25.945647+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '28f138cc-677f-439c-968f-ea4e3432f2bd', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 21:42:06.598417+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cd028079-e28b-4973-b3bb-ba55f25b5d79', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 21:42:06.610429+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '58513603-fd12-443d-b231-fae4a9d5bd67', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 22:47:44.45026+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3db92aad-9115-4cb6-8886-71363ae66527', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-12 22:47:44.462325+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '277de911-965d-4b4c-ba58-1b0ae0baa797', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 13:24:23.593159+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fd9f6896-738e-46c8-a05c-a46610bfeba7', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 13:24:23.608139+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c5d75b46-9a16-4de9-8e7d-44d0c5f617fc', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 14:31:31.546811+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a574387f-d3dc-451e-b362-1f3ee65c3a03', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 14:31:31.561893+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3dd0a4cc-2eee-4b02-a7ea-a425d89d4603', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 15:30:08.770261+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f061ff34-a84d-4e8a-a03f-68a2abbdb571', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 15:30:08.785834+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0b64556c-be80-4314-8d99-f0dcefa18911', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 16:34:45.365861+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7cbe9f01-4de9-4839-ac38-3fc5e339b044', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 16:34:45.377039+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f7d08d5b-32d8-499b-b84d-14877afca8d7', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 17:44:03.931422+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '24229df0-186d-4494-b010-8d207bbfd91f', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 17:44:03.96187+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'df2a5963-273a-4e7e-8e48-0c3940c4f722', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 19:07:58.04957+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a5156365-349d-4334-82fc-16459246e28a', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 19:07:58.074084+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '505eae89-b725-49aa-926a-caa2ce1a644a', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 20:38:05.937681+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cd1172ba-f8bc-42b1-a423-5a23663eea76', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 20:38:05.953385+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c291c726-e5b0-442f-bc24-d47f17166624', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 21:55:58.908179+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b0874ade-adb3-435e-84c9-b8256b82f6d0', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 21:55:58.929292+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0d8702c5-1d80-401a-888c-d6f151204597', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 13:18:27.639537+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '63ae6a2d-077d-4362-9ba6-0808c40e566e', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 13:18:27.653173+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9fd7d4d2-bdc5-4cce-9716-d46eb318060e', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 14:51:32.731453+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'badb2062-4315-442f-82e3-efa216155702', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 14:51:32.749717+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b09b4f44-2c61-4444-8dd5-c3089f7f6c0a', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 15:55:52.150935+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4963083b-44b0-4ee0-b694-ae9558f52d5f', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 15:55:52.172198+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9cdca3cd-7a4f-4258-81b4-a1f099ff9bcf', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 16:57:09.970297+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '03bf7d37-aade-40d8-a8c1-ff227987f491', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 16:57:09.985222+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '89c551ef-e483-4425-9366-2920e08a3893', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 19:07:50.804653+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '12871516-5688-4cb4-b685-cbc95a7e5167', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 19:07:50.814885+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '52dfb099-dfb8-437d-bd17-9764d5fd19cc', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 20:18:52.998822+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'adb6b353-353d-46a3-b9e1-040aaef1b27a', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 20:18:53.026601+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '49bba29d-3dfc-4bbb-9b1c-85717714a503', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 21:28:30.793597+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7ad47b5f-035a-4df7-9de5-1b0af772755b', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 21:28:30.821833+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '057e0dc0-161f-41d9-9cc2-3223c52da8a1', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 14:02:19.209213+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8bb67aa5-61ea-4254-b714-866a9ad0b9d1', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 14:02:19.220747+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5b935538-f11a-40b2-870c-1f8c0213bace', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 15:00:31.970944+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6e0f1dc8-ee11-41e7-9762-f4e511a86ba3', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 15:00:32.038344+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a1385961-3cc2-43f1-a06d-e7ce22fcf92d', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 16:05:17.963674+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '78c2d1af-087f-451f-b222-4c15855f4914', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 16:05:17.988471+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '47cf351f-be93-45e3-8b28-b1d6ee6bb25c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 18:04:26.380902+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4cb2e42b-3941-4288-8657-fd8fa85dea87', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 18:04:26.414377+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e2bfad57-b2e1-4f22-af7e-3bf6af004923', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 19:18:42.754065+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4f04a66b-e006-4e0f-9edb-de48d97a9f66', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 19:18:42.767703+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd8b3c23a-7b8b-4955-a793-d5fae4e1ad8d', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 20:30:09.893258+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9af133e7-842e-4f64-a995-010983f695ca', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 20:30:09.918759+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2d31c20d-161a-428f-ba7c-8aa1d6059fb2', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 21:31:57.531775+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1713d18f-29d9-4091-8275-1f78813a1dc0', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 21:31:57.550562+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '943f5f43-f746-4770-9358-a7dae09b990c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:21:51.699709+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '23537883-86a8-4446-840a-aa87524c5a49', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 13:21:51.728771+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '31cd4dae-a6a8-42f4-ab61-3fdba4ca82d3', '{"action":"login","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-18 13:24:38.107827+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4794b759-13e6-4bf2-b7f0-968dc0778b96', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 14:19:56.871689+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9ec34bc7-2a9f-4039-b31e-7e8852587ec4', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 14:19:56.889148+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '42e383e8-76b3-4233-8ccd-7af2aeed58a1', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 14:22:53.37828+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5513a2de-f01f-4cea-9fff-48c6ca69764d', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 14:22:53.386061+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3f8fae59-1eef-495c-a471-630161ad887a', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 15:17:55.801028+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'de516989-63f4-4348-be0d-f198ad39a214', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 15:17:55.819548+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'dc107a4b-f51b-4163-876b-6de743b4b548', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 16:22:14.356833+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ae7041f2-6f39-4312-a271-b7d017027174', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 16:22:14.375761+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4b017acb-6c1a-43d4-bcdc-50b9d4dd8e47', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 17:21:20.724251+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'defcf301-3c95-44bc-8346-26025b8a96d2', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 17:21:20.748093+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0ca1786a-28d6-4f07-8fdb-8a5f5670d22a', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 19:14:41.27879+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '517fac87-92a1-4123-80a6-7c439491f3d0', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 19:14:41.304196+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c748a5b9-0a74-4dbd-92b6-dc8404d64edc', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 20:13:51.838937+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2a926490-4f2b-4099-b01e-cf0b3d1bc26a', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 20:13:51.85827+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2c6464ba-d13d-4a68-957b-f85a87ca8e28', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 21:12:20.919548+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '761c1759-55f3-47ae-bcc2-d59a9f3f92ce', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 21:12:20.943552+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '592d4843-f653-4af3-aaa1-7d90098bfab0', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 13:16:44.191903+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0487a87a-35f0-4110-9cb9-f31a79741cbf', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 13:16:44.221706+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'eb6f40d0-b2b4-4f35-9386-49b4aacea629', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 14:16:13.529385+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'eff77f52-a6a8-4e3e-804b-cb362bebfa83', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 14:16:13.550253+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6b0b0ab9-d5fb-4eda-9d8a-5b8ea7f637f2', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 15:14:36.321038+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd718cdb8-630f-4415-9637-de6177cc9c59', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 15:14:36.331438+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5385dda3-f58c-4381-85cd-addac639848e', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 16:13:53.446125+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f1700795-f48d-4aae-87cf-0b0868ac7de5', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 16:13:53.45471+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '774bce96-90bc-4980-a1a1-edfb13c6779a', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 17:22:49.067466+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6a5319d5-43d1-4753-bf13-d9f191c08b13', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 17:22:49.106515+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4ba166df-c764-4128-9c20-4981c31595ca', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 19:15:45.28054+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'aaa502a1-9946-4bb3-867e-5a87a99caecd', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 19:15:45.300919+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'df85ac8a-f030-46c3-aea4-e8d8a45335d5', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 20:13:46.256904+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7d605e47-b58d-4004-97f7-5c5ee6b71e8d', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 20:13:46.286244+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'dcc4d039-e357-4fdb-aa20-0ae8d9888c51', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 21:11:49.427964+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '499191ed-479c-4181-a66e-76774911f2aa', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 21:11:49.458385+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3597758f-ed36-4ff1-ad42-cfbb12190747', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 22:10:28.426376+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'aaeb70f7-c4b8-4cfe-86a8-2fc64e1eaee9', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 22:10:28.444146+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '176931e7-e67c-402e-8a00-796429571a64', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 23:08:55.479463+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd9e80d30-b537-4e8c-b414-47e0edf5c6a9', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 23:08:55.501577+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2484854b-f5e4-4f34-b52f-42aba6dfd23c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-20 00:08:05.79027+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6fc6ee48-7737-4ccd-8678-13a496d4ad01', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-20 00:08:05.806448+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a149787f-07a5-41fc-ad10-a993039b5815', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 13:40:47.927756+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bbbd199e-648e-45f9-b8a6-287bcf61928e', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 13:40:47.945127+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5fa5f374-a28e-4064-bdcc-f14203a11608', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 14:52:41.242269+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3305930d-88ae-4683-8857-97c9c3fce605', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 14:52:41.272117+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e64023eb-8937-49c1-8c93-e8722a0e6907', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 15:56:12.96324+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'be69b1da-9510-4b40-92d1-70ece1e95326', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 15:56:12.976984+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '48be8a45-7795-4856-a74c-891201646133', '{"action":"login","actor_id":"60bc1460-6cbf-48b0-937c-eb2322ca1cbc","actor_username":"dlatorre@inxora.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-22 16:16:17.206913+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '68663a07-bcf7-489f-97e1-1a9fa8b8c621', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 16:59:21.341515+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '126ee843-073f-4a84-a75f-db4b416df7ce', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 16:59:21.364878+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9597acb4-f9bc-4a02-8f20-86c475405a25', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 18:00:58.459774+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a0c22d57-d118-47bc-a859-7980648836a9', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 18:00:58.475568+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fe9670ff-d0fe-41bf-9f9d-d3ebec015f76', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 19:00:02.977733+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '89d9ca88-65a2-4825-a09a-42070f6d8e66', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 19:00:02.999272+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '11eab1f7-ec37-49ab-a0ed-95f0dad75b00', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 19:58:08.913322+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd51ab9f1-00a6-4ad1-8393-377ab6552b8b', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 19:58:08.927532+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b8120a9f-b6bc-4139-9b0a-7285c8324bd3', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 20:56:43.908149+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7e3981b1-d66c-4338-b9f7-ef2c0e587071', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 20:56:43.923169+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '06081029-1362-436f-8551-69c0273a0837', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 21:54:50.488935+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e5846e77-dbfd-466c-afc2-95a295f52aaa', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-22 21:54:50.502217+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '88e43d3b-62a9-441a-a103-dc52f6a613c4', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 13:19:57.259674+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '308d4442-8505-48c7-ad95-be9646e69df1', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 13:19:57.272343+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6e94bfd2-2afb-4ac2-b763-824664ff8523', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 14:18:19.964857+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0c68d0d0-ec6e-4043-9f45-6a1cdac8450b', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 14:18:19.97708+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9b6e4f60-f57b-4ca5-8b12-82e2c482d990', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 15:16:24.042971+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f04b28cb-a046-45cf-b90e-6b1e5c0a923b', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 15:16:24.056237+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c8d23f9e-b9c4-4584-b97d-1c4483cb7fd0', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 16:15:44.729044+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2523fdf2-b5bf-4005-a22c-7d50a57feafd', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 16:15:44.756412+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ffde44ff-87ea-45f3-8b71-aa4b2bcbee10', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 17:13:54.472013+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b7f530fb-3aaf-4d86-8cff-e5f6197d7dc2', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 17:13:54.491732+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a4cb577f-8f5b-40f4-8e8d-9b24552dfe52', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 19:09:19.307783+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2fac5659-24d2-4b36-83fe-5a63408c3501', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 19:09:19.340796+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b280e337-5a18-41f3-9a1a-8bc4aa6ad755', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 20:07:53.248403+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0bf4d9ca-f04b-4410-9a38-b9a010e5072b', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 20:07:53.275877+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8a524377-0404-4f3e-a790-7ad3774280d3', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 21:06:41.973879+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '83a3e0bc-a1c2-4ba6-bec9-cc6d1ae85a29', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 21:06:41.983971+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8cc58a15-e239-496e-82cc-5829ae6b59cd', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 21:06:42.035643+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '846bc84e-38bb-4f54-acf9-16785b330c9e', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 22:05:35.707462+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ae41b6d4-f6a6-4594-bf9e-65b7233d959e', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-23 22:05:35.719345+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8b4eae29-2234-40ce-8652-8233a0ecb427', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 13:43:21.696238+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '62acf465-229f-4f9b-b9de-d3a52209b89f', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 13:43:21.707933+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '087a8d86-90be-48db-ba6d-3bae8637678f', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 15:20:47.812756+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9d487c2c-2903-4363-bb79-6faa81fb7022', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 15:20:47.839744+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fabfad0b-0d8f-42e8-a632-4ed2594cecd7', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 16:19:10.559373+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5b55ed4f-738d-4400-ba9a-b1e1078c9093', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 16:19:10.579731+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '744260c3-354f-4e40-93b7-b5b6e1a92736', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 17:21:31.298654+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e9e47c93-d27e-4a27-a4c7-3a1685950739', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 17:21:31.312661+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3d15c94c-e168-4075-ba9f-bbb854c6b986', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 18:37:25.586638+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f12a170b-f99e-4e52-8a31-94d7803ead26', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 18:37:25.622195+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1e04856b-9fa0-405b-a743-4ed0b8dfeb06', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 19:35:35.477178+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2081e92e-cf38-4975-8d78-013c63a43080', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 19:35:35.490051+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2df0f44c-ecd9-4288-b0c8-e8d071a45934', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 20:33:39.016263+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5bfcbce7-628d-4bd3-9090-87211b21e321', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 20:33:39.044182+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2aa8402a-2dba-460e-882d-bf56afff6869', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 21:34:18.673164+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '59e97eb2-9cf8-4489-ab5c-6664fec7faf9', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-24 21:34:18.706487+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cf715cb4-c393-4ea0-9f52-3f1b3dcc5e34', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 13:20:52.167978+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0dc37f71-77c0-4b79-a2fa-4ddb35140634', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 13:20:52.199509+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6290ce65-28f7-4da8-989c-fa1d6779486f', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 14:19:20.845887+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2bac27e5-8b3b-47ba-a83e-eb255a39a1ba', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 14:19:20.860613+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b5c83c22-7c4b-4e0e-9515-010f9fd2c7ce', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 15:17:42.86519+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8a85d7fc-bcdc-4903-bd03-81b467ed1917', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 15:17:42.881686+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e37561f2-b814-4399-83d0-94ef89991846', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 16:16:03.10193+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '809248b8-5f0b-4cb7-8a28-862ffcdc6eb4', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 16:16:03.1251+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a79a66ce-cee3-4781-a9cb-790a94256691', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 17:16:22.655812+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '230ec4ad-8ed0-47f9-9efc-da2a1dd73234', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 17:16:22.685573+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8ffe76e0-ea59-402f-90bc-a7f4d0cfb416', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 19:10:54.505872+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '82dae568-f870-41cb-96e8-f9a0f01d0699', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 19:10:54.532107+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1b616525-41e3-4f0d-9aac-8f963eb26fa8', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 20:29:20.523972+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c87aa03c-6f34-4eb7-8f49-d53f90726212', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 20:29:20.554932+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6a3a2fd1-9c9f-4247-819d-73149e9305ae', '{"action":"logout","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"account"}', '2025-09-25 21:01:16.668549+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9d048de8-5aa0-44cd-9103-515a17c83979', '{"action":"login","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-25 21:02:55.279267+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '18f037ec-8bfd-4153-a784-bae1a3e0ca6c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 22:03:47.289905+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '88e05875-0fd4-4ffa-bc8f-7918600efba0', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 22:03:47.313419+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c0e090c3-2a1b-4fb5-b78e-aaf262922455', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 22:03:47.398869+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '59d61829-d9a3-4b62-a986-2d777f03271b', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 13:22:11.744669+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '452af0cd-b74f-4b03-a784-a3a466fd1e86', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 13:22:11.758175+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b6d7d61c-2563-4a08-8878-14aa745ad287', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 14:27:00.285913+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'adac5f21-9de0-4d08-a27c-6ac4711545d8', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 14:27:00.298696+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4646b963-3f2c-4abd-9157-09fc0daa6a39', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 15:37:22.077004+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd41148fc-1f79-404e-a6e9-21fe3ba92e93', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 15:37:22.08975+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c1e1dfd8-3bba-49a3-a308-0c2111c0999c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 16:43:02.083119+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b58257c8-2232-4d0a-b384-12b1f6d24f57', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 16:43:02.114167+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c5853d5b-851e-42c2-85ba-d1fbe530edf0', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 17:43:51.717427+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'eb00bf59-e3d1-46a1-849d-ee6aed7b4ca0', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 17:43:51.72802+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b0793e00-cf5f-4562-8dc9-9885344ff0eb', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 18:42:11.219286+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7bbd7057-563f-4f37-8245-2228b28df004', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 18:42:11.247876+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3418ff91-3e66-47cb-bc03-e6c720e4fcd4', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 19:56:06.778777+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f22c9186-e25d-4784-8d57-bfd5da10159c', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 19:56:06.811741+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ed28e483-8eac-45a6-92d6-d46230f339d9', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 13:11:57.612611+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0bc51abd-650f-498f-a17e-347d5d8c08b1', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 13:11:57.625179+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5e4c8637-6616-4df1-b3a2-dba4f7aeb712', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 14:10:13.34744+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8d9446e7-01c4-4faf-8110-54156531aa61', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 14:10:13.369257+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '697dc324-96c9-4bf4-978d-24d067f5abdc', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 15:08:39.419174+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4ec356e7-b51c-44d3-be27-af008bdb4828', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 15:08:39.433304+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '169b931e-a0b6-4027-bc1d-6b9543ec906f', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 16:33:29.204119+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '613329b1-7277-43f6-ab4f-712d635469db', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 16:33:29.23197+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a537030f-6be6-4119-8a89-2f90d4c83242', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 17:31:44.460124+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd1f344d9-45c9-4d86-b8bb-d71f1c64c388', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 17:31:44.471645+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a90e3eab-c80b-49b4-aede-98760e103ef5', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 19:14:03.350885+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '662b7c1c-f71a-4715-b1bd-11c097c5ef1f', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 19:14:03.383924+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd8158863-ec45-45d8-b1f8-f834c5b1b9a7', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 20:21:46.181104+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '02b5be1b-e8d1-4ad1-8602-1b55f658a53f', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-29 20:21:46.21294+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5b5cf750-45bc-4799-bf69-2f807957fd3c', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-30 13:30:37.339076+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6e18e96b-5149-4d24-932c-c95802ffa537', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-30 13:30:37.369654+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c04f0107-05da-4d41-baef-3b8214681f73', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-30 14:33:11.755107+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '881dfbc3-65f2-4c40-bf10-f2d46002a126', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-30 14:33:11.783034+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '88e8fe16-ce79-42ad-8a33-9257bfd95ae9', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-30 15:40:00.110924+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '33693280-352a-4ab1-a3de-8f5f0371de74', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-30 15:40:00.141695+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c16452c2-2220-4ef2-b7a6-bb62c79636aa', '{"action":"token_refreshed","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-30 16:38:18.242529+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a5c75139-60a2-45c0-87cc-a0dc82119018', '{"action":"token_revoked","actor_id":"82df97ec-0c85-495e-b673-31c03757603b","actor_username":"rpena@inxora.com","actor_via_sso":false,"log_type":"token"}', '2025-09-30 16:38:18.266153+00', '');


--
-- TOC entry 5528 (class 0 OID 16927)
-- Dependencies: 373
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 5519 (class 0 OID 16725)
-- Dependencies: 364
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('82df97ec-0c85-495e-b673-31c03757603b', '82df97ec-0c85-495e-b673-31c03757603b', '{"sub": "82df97ec-0c85-495e-b673-31c03757603b", "email": "rpena@inxora.com", "email_verified": false, "phone_verified": false}', 'email', '2025-08-26 15:25:21.247149+00', '2025-08-26 15:25:21.247214+00', '2025-08-26 15:25:21.247214+00', 'fe277f77-e468-4f3b-b7c0-62c231ef12f5');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('36e6097c-3167-4a35-8d22-c5036418c0d5', '36e6097c-3167-4a35-8d22-c5036418c0d5', '{"sub": "36e6097c-3167-4a35-8d22-c5036418c0d5", "email": "raponte@inxora.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-10 21:39:46.583662+00', '2025-09-10 21:39:46.583726+00', '2025-09-10 21:39:46.583726+00', '14555e14-b048-47df-9734-f1c535fc22c4');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('60bc1460-6cbf-48b0-937c-eb2322ca1cbc', '60bc1460-6cbf-48b0-937c-eb2322ca1cbc', '{"sub": "60bc1460-6cbf-48b0-937c-eb2322ca1cbc", "email": "dlatorre@inxora.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-10 21:40:15.451452+00', '2025-09-10 21:40:15.451513+00', '2025-09-10 21:40:15.451513+00', '246835b4-9729-4efe-bc2b-3c334a00045c');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('a5dbdcdd-081e-4103-81b8-c09a95c249fc', 'a5dbdcdd-081e-4103-81b8-c09a95c249fc', '{"sub": "a5dbdcdd-081e-4103-81b8-c09a95c249fc", "email": "jhuamani@inxora.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-10 21:40:48.99369+00', '2025-09-10 21:40:48.994309+00', '2025-09-10 21:40:48.994309+00', '49070d48-a47c-4ee7-80eb-055dc4533ab0');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('5ed36a9e-5329-4b84-a3f0-7e8b9a01be5b', '5ed36a9e-5329-4b84-a3f0-7e8b9a01be5b', '{"sub": "5ed36a9e-5329-4b84-a3f0-7e8b9a01be5b", "email": "zvaras@inxora.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-10 21:41:14.292541+00', '2025-09-10 21:41:14.292595+00', '2025-09-10 21:41:14.292595+00', '681d63bc-a0d2-40b2-bbac-f02f02110bfe');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('2c387ed4-e734-46d0-ad85-666fa04a6c69', '2c387ed4-e734-46d0-ad85-666fa04a6c69', '{"sub": "2c387ed4-e734-46d0-ad85-666fa04a6c69", "email": "nmantilla@inxora.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-10 21:41:43.004122+00', '2025-09-10 21:41:43.004755+00', '2025-09-10 21:41:43.004755+00', 'cd34348d-a556-46e3-9202-a7a97f6e3f66');


--
-- TOC entry 5513 (class 0 OID 16518)
-- Dependencies: 355
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 5523 (class 0 OID 16814)
-- Dependencies: 368
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('4e232a3c-4946-4c6c-8f25-ab181d515538', '2025-09-22 16:16:17.255615+00', '2025-09-22 16:16:17.255615+00', 'password', '253d6831-a79b-41fa-b949-d135f2bd8c5d');
INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('6ad2ce9c-b9d1-4958-9c23-7e94454f7344', '2025-09-25 21:02:55.294157+00', '2025-09-25 21:02:55.294157+00', 'password', '5440c74e-cd0d-40ba-b522-df2fdf3d95f2');


--
-- TOC entry 5522 (class 0 OID 16802)
-- Dependencies: 367
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 5521 (class 0 OID 16789)
-- Dependencies: 366
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 5641 (class 0 OID 77035)
-- Dependencies: 495
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 5529 (class 0 OID 16977)
-- Dependencies: 374
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 5512 (class 0 OID 16507)
-- Dependencies: 354
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 181, 'yctwdl7rl3ry', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-25 21:02:55.289221+00', '2025-09-25 22:03:47.315381+00', NULL, '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 183, 'mnpgsmauy7le', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-26 13:22:11.774906+00', '2025-09-26 14:27:00.299359+00', 'hfnfazku3tsk', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 185, 'bkx7mpxwfbt5', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-26 15:37:22.10545+00', '2025-09-26 16:43:02.11486+00', '6rsbhip65vtu', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 187, 'sfrvv3ejz2wr', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-26 17:43:51.739925+00', '2025-09-26 18:42:11.248597+00', 'p5lx36i7ydhc', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 189, 'hsfet2elbunc', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-26 19:56:06.83891+00', '2025-09-29 13:11:57.630542+00', 'twxropgmpda4', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 191, 'rz7saltv4wit', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-29 14:10:13.391364+00', '2025-09-29 15:08:39.435656+00', 'ddqes74kmfwv', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 193, 'fpa6parn5gwz', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-29 16:33:29.258234+00', '2025-09-29 17:31:44.473191+00', 'pu2swnjfcuf5', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 195, '3gimctocorls', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-29 19:14:03.41833+00', '2025-09-29 20:21:46.223039+00', 'zefszawv43qv', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 197, 'fwskgmz4zugs', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-30 13:30:37.407384+00', '2025-09-30 14:33:11.784275+00', 'q6pfm4ajh7l3', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 199, 'hg4blym6lk6m', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-30 15:40:00.167659+00', '2025-09-30 16:38:18.268033+00', 'gpl7ldx7mwhf', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 182, 'hfnfazku3tsk', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-25 22:03:47.336566+00', '2025-09-26 13:22:11.759697+00', 'yctwdl7rl3ry', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 184, '6rsbhip65vtu', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-26 14:27:00.311533+00', '2025-09-26 15:37:22.092865+00', 'mnpgsmauy7le', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 186, 'p5lx36i7ydhc', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-26 16:43:02.144268+00', '2025-09-26 17:43:51.730604+00', 'bkx7mpxwfbt5', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 188, 'twxropgmpda4', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-26 18:42:11.280303+00', '2025-09-26 19:56:06.81311+00', 'sfrvv3ejz2wr', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 190, 'ddqes74kmfwv', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-29 13:11:57.644743+00', '2025-09-29 14:10:13.373363+00', 'hsfet2elbunc', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 192, 'pu2swnjfcuf5', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-29 15:08:39.453927+00', '2025-09-29 16:33:29.234457+00', 'rz7saltv4wit', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 194, 'zefszawv43qv', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-29 17:31:44.480646+00', '2025-09-29 19:14:03.387919+00', 'fpa6parn5gwz', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 196, 'q6pfm4ajh7l3', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-29 20:21:46.252313+00', '2025-09-30 13:30:37.371853+00', '3gimctocorls', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 198, 'gpl7ldx7mwhf', '82df97ec-0c85-495e-b673-31c03757603b', true, '2025-09-30 14:33:11.811128+00', '2025-09-30 15:40:00.145942+00', 'fwskgmz4zugs', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 200, 'mot6fcpcizuj', '82df97ec-0c85-495e-b673-31c03757603b', false, '2025-09-30 16:38:18.288063+00', '2025-09-30 16:38:18.288063+00', 'hg4blym6lk6m', '6ad2ce9c-b9d1-4958-9c23-7e94454f7344');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 150, 'qijjgll76sti', '60bc1460-6cbf-48b0-937c-eb2322ca1cbc', false, '2025-09-22 16:16:17.234425+00', '2025-09-22 16:16:17.234425+00', NULL, '4e232a3c-4946-4c6c-8f25-ab181d515538');


--
-- TOC entry 5526 (class 0 OID 16856)
-- Dependencies: 371
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 5527 (class 0 OID 16874)
-- Dependencies: 372
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 5515 (class 0 OID 16533)
-- Dependencies: 357
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.schema_migrations (version) VALUES ('20171026211738');
INSERT INTO auth.schema_migrations (version) VALUES ('20171026211808');
INSERT INTO auth.schema_migrations (version) VALUES ('20171026211834');
INSERT INTO auth.schema_migrations (version) VALUES ('20180103212743');
INSERT INTO auth.schema_migrations (version) VALUES ('20180108183307');
INSERT INTO auth.schema_migrations (version) VALUES ('20180119214651');
INSERT INTO auth.schema_migrations (version) VALUES ('20180125194653');
INSERT INTO auth.schema_migrations (version) VALUES ('00');
INSERT INTO auth.schema_migrations (version) VALUES ('20210710035447');
INSERT INTO auth.schema_migrations (version) VALUES ('20210722035447');
INSERT INTO auth.schema_migrations (version) VALUES ('20210730183235');
INSERT INTO auth.schema_migrations (version) VALUES ('20210909172000');
INSERT INTO auth.schema_migrations (version) VALUES ('20210927181326');
INSERT INTO auth.schema_migrations (version) VALUES ('20211122151130');
INSERT INTO auth.schema_migrations (version) VALUES ('20211124214934');
INSERT INTO auth.schema_migrations (version) VALUES ('20211202183645');
INSERT INTO auth.schema_migrations (version) VALUES ('20220114185221');
INSERT INTO auth.schema_migrations (version) VALUES ('20220114185340');
INSERT INTO auth.schema_migrations (version) VALUES ('20220224000811');
INSERT INTO auth.schema_migrations (version) VALUES ('20220323170000');
INSERT INTO auth.schema_migrations (version) VALUES ('20220429102000');
INSERT INTO auth.schema_migrations (version) VALUES ('20220531120530');
INSERT INTO auth.schema_migrations (version) VALUES ('20220614074223');
INSERT INTO auth.schema_migrations (version) VALUES ('20220811173540');
INSERT INTO auth.schema_migrations (version) VALUES ('20221003041349');
INSERT INTO auth.schema_migrations (version) VALUES ('20221003041400');
INSERT INTO auth.schema_migrations (version) VALUES ('20221011041400');
INSERT INTO auth.schema_migrations (version) VALUES ('20221020193600');
INSERT INTO auth.schema_migrations (version) VALUES ('20221021073300');
INSERT INTO auth.schema_migrations (version) VALUES ('20221021082433');
INSERT INTO auth.schema_migrations (version) VALUES ('20221027105023');
INSERT INTO auth.schema_migrations (version) VALUES ('20221114143122');
INSERT INTO auth.schema_migrations (version) VALUES ('20221114143410');
INSERT INTO auth.schema_migrations (version) VALUES ('20221125140132');
INSERT INTO auth.schema_migrations (version) VALUES ('20221208132122');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195500');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195800');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195900');
INSERT INTO auth.schema_migrations (version) VALUES ('20230116124310');
INSERT INTO auth.schema_migrations (version) VALUES ('20230116124412');
INSERT INTO auth.schema_migrations (version) VALUES ('20230131181311');
INSERT INTO auth.schema_migrations (version) VALUES ('20230322519590');
INSERT INTO auth.schema_migrations (version) VALUES ('20230402418590');
INSERT INTO auth.schema_migrations (version) VALUES ('20230411005111');
INSERT INTO auth.schema_migrations (version) VALUES ('20230508135423');
INSERT INTO auth.schema_migrations (version) VALUES ('20230523124323');
INSERT INTO auth.schema_migrations (version) VALUES ('20230818113222');
INSERT INTO auth.schema_migrations (version) VALUES ('20230914180801');
INSERT INTO auth.schema_migrations (version) VALUES ('20231027141322');
INSERT INTO auth.schema_migrations (version) VALUES ('20231114161723');
INSERT INTO auth.schema_migrations (version) VALUES ('20231117164230');
INSERT INTO auth.schema_migrations (version) VALUES ('20240115144230');
INSERT INTO auth.schema_migrations (version) VALUES ('20240214120130');
INSERT INTO auth.schema_migrations (version) VALUES ('20240306115329');
INSERT INTO auth.schema_migrations (version) VALUES ('20240314092811');
INSERT INTO auth.schema_migrations (version) VALUES ('20240427152123');
INSERT INTO auth.schema_migrations (version) VALUES ('20240612123726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240729123726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240802193726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240806073726');
INSERT INTO auth.schema_migrations (version) VALUES ('20241009103726');
INSERT INTO auth.schema_migrations (version) VALUES ('20250717082212');
INSERT INTO auth.schema_migrations (version) VALUES ('20250731150234');


--
-- TOC entry 5520 (class 0 OID 16755)
-- Dependencies: 365
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) VALUES ('6ad2ce9c-b9d1-4958-9c23-7e94454f7344', '82df97ec-0c85-495e-b673-31c03757603b', '2025-09-25 21:02:55.285709+00', '2025-09-30 16:38:18.308229+00', NULL, 'aal1', NULL, '2025-09-30 16:38:18.306747', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '38.253.158.33', NULL);
INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) VALUES ('4e232a3c-4946-4c6c-8f25-ab181d515538', '60bc1460-6cbf-48b0-937c-eb2322ca1cbc', '2025-09-22 16:16:17.226581+00', '2025-09-22 16:16:17.226581+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '181.66.176.122', NULL);


--
-- TOC entry 5525 (class 0 OID 16841)
-- Dependencies: 370
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 5524 (class 0 OID 16832)
-- Dependencies: 369
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- TOC entry 5510 (class 0 OID 16495)
-- Dependencies: 352
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '36e6097c-3167-4a35-8d22-c5036418c0d5', 'authenticated', 'authenticated', 'raponte@inxora.com', '$2a$10$p9UaKezjC7zj.1DRbfEBMOj90iXOqKlE38n21U9oPtQuV6Jr3hi0O', '2025-09-10 21:39:46.595802+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-10 21:39:46.562216+00', '2025-09-10 21:39:46.597726+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', 'a5dbdcdd-081e-4103-81b8-c09a95c249fc', 'authenticated', 'authenticated', 'jhuamani@inxora.com', '$2a$10$qiKqdCrSnKwjZ6wFWNTVeuIFDRFXQbt5JykENTVCoW1f2/31hnz52', '2025-09-10 21:40:49.000786+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-10 21:40:48.987059+00', '2025-09-10 21:40:49.002867+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '82df97ec-0c85-495e-b673-31c03757603b', 'authenticated', 'authenticated', 'rpena@inxora.com', '$2a$10$H14ybPJRinJ/qUIO2y02xeXxv27d1XmuunYbqOq13wmblt4/M9c2.', '2025-08-26 15:25:21.257599+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-25 21:02:55.285626+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-08-26 15:25:21.219009+00', '2025-09-30 16:38:18.298296+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '5ed36a9e-5329-4b84-a3f0-7e8b9a01be5b', 'authenticated', 'authenticated', 'zvaras@inxora.com', '$2a$10$HQ3IHlx.rizA0.nT8Tdb5uaVeY1zohqpUPI8/HczMJT4e4QNWIKO.', '2025-09-10 21:41:14.296358+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-10 21:41:14.29092+00', '2025-09-10 21:41:14.297037+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '60bc1460-6cbf-48b0-937c-eb2322ca1cbc', 'authenticated', 'authenticated', 'dlatorre@inxora.com', '$2a$10$Ks3mNeZdvxLzJBr7ZzlBA./xSRl9d4BMEU1H/gyIlfwd4yK2ERPJm', '2025-09-10 21:40:15.455322+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-22 16:16:17.226489+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-10 21:40:15.450344+00', '2025-09-22 16:16:17.25201+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '2c387ed4-e734-46d0-ad85-666fa04a6c69', 'authenticated', 'authenticated', 'nmantilla@inxora.com', '$2a$10$M4iOloVAQ9PNH/4XVPy./u3VKhPKqZbJyZ8iaNruGy9XW7CMRg9Gi', '2025-09-10 21:41:43.035376+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-10 21:41:42.940741+00', '2025-09-10 21:41:43.045671+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- TOC entry 5632 (class 0 OID 67962)
-- Dependencies: 481
-- Data for Name: carrito_compra; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5559 (class 0 OID 66777)
-- Dependencies: 408
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categoria (id, nombre, descripcion, activo, fecha_creacion) VALUES (4, 'NEUMATICA_HIDRAULICA', 'Cilindros, válvulas neumáticas, compresores, bombas', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.categoria (id, nombre, descripcion, activo, fecha_creacion) VALUES (5, 'HERRAMIENTAS_MANIOBRA', 'Herramientas manuales, eléctricas, equipos de elevación', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.categoria (id, nombre, descripcion, activo, fecha_creacion) VALUES (6, 'MECANICA_INDUSTRIAL', 'Rodamientos, correas, cadenas, transmisiones mecánicas', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.categoria (id, nombre, descripcion, activo, fecha_creacion) VALUES (7, 'VALVULAS_MANGUERAS', 'Válvulas industriales, mangueras, conexiones hidráulicas', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.categoria (id, nombre, descripcion, activo, fecha_creacion) VALUES (8, 'LIMPIEZA_MANTENIMIENTO', 'Productos químicos, aditivos, equipos de limpieza industrial', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.categoria (id, nombre, descripcion, activo, fecha_creacion) VALUES (9, 'SEGURIDAD_INDUSTRIAL', 'EPPs, señalización, equipos de seguridad laboral', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.categoria (id, nombre, descripcion, activo, fecha_creacion) VALUES (10, 'AUTOMATIZACION', 'PLCs, variadores, sensores, sistemas de control automático', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.categoria (id, nombre, descripcion, activo, fecha_creacion) VALUES (1, 'CABLES Y CONDUCTORES', 'Cables eléctricos', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.categoria (id, nombre, descripcion, activo, fecha_creacion) VALUES (2, 'PROTECCIONES ELÉCTRICAS', 'Interruptores y protecciones', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.categoria (id, nombre, descripcion, activo, fecha_creacion) VALUES (3, 'TUBERÍAS', 'Tuberías y accesorios', true, '2025-08-26 15:16:04.347035');


--
-- TOC entry 5541 (class 0 OID 66653)
-- Dependencies: 390
-- Data for Name: ciudad; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ciudad (id, codigo, nombre, id_pais, codigo_postal, activo, fecha_creacion) VALUES (1, 'LIM', 'Lima', 1, NULL, true, '2025-08-26 15:16:04.347035');


--
-- TOC entry 5570 (class 0 OID 66864)
-- Dependencies: 419
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cliente (id, nombre, apellidos, correo, telefono, contrasena, razon_social, documento_personal, documento_empresa, id_rubro, id_tipo_cliente, id_pais, activo, verificado, fecha_registro, fecha_ultima_compra, id_tipo_contacto) VALUES (4, '', '', 'gffs@gmail.com', '949165670', '123456789', 'pepito sac', NULL, '12345678900', 7, 2, 1, true, false, '2025-09-11 13:36:10.749', NULL, 2);


--
-- TOC entry 5599 (class 0 OID 67323)
-- Dependencies: 448
-- Data for Name: comunicacion_solicitud; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5555 (class 0 OID 66743)
-- Dependencies: 404
-- Data for Name: condiciones_comerciales; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.condiciones_comerciales (id, codigo, nombre, descripcion, terminos_generales, terminos_entrega, terminos_garantia, detalle_entrega, ofrece_credito, dias_credito, condiciones_credito, monto_min_pedido, id_moneda_min_pedido, descuento_volumen, activo, fecha_creacion) VALUES (1, 'STD_B2B', 'Estándar B2B', NULL, 'Condiciones comerciales estándar para empresas', NULL, NULL, NULL, false, 0, NULL, NULL, NULL, 0.00, true, '2025-08-26 15:16:04.347035');


--
-- TOC entry 5578 (class 0 OID 66982)
-- Dependencies: 427
-- Data for Name: configuracion_archivos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5580 (class 0 OID 66994)
-- Dependencies: 429
-- Data for Name: configuracion_fe; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5577 (class 0 OID 66968)
-- Dependencies: 426
-- Data for Name: configuracion_sistema; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.configuracion_sistema (clave, valor, descripcion, tipo_dato, categoria, editable, iso_code_pais, activo, fecha_creacion, fecha_actualizacion) VALUES ('EMPRESA_NOMBRE', 'INXORA S.A.C.', 'Nombre de la empresa', 'STRING', 'EMPRESA', true, NULL, true, '2025-08-26 15:16:04.347035', '2025-08-26 15:16:04.347035');
INSERT INTO public.configuracion_sistema (clave, valor, descripcion, tipo_dato, categoria, editable, iso_code_pais, activo, fecha_creacion, fecha_actualizacion) VALUES ('EMPRESA_RUC', '20603436475', 'RUC de la empresa', 'STRING', 'EMPRESA', true, NULL, true, '2025-08-26 15:16:04.347035', '2025-08-26 15:16:04.347035');
INSERT INTO public.configuracion_sistema (clave, valor, descripcion, tipo_dato, categoria, editable, iso_code_pais, activo, fecha_creacion, fecha_actualizacion) VALUES ('MONEDA_PRINCIPAL', 'PEN', 'Moneda principal del sistema', 'STRING', 'SISTEMA', true, NULL, true, '2025-08-26 15:16:04.347035', '2025-08-26 15:16:04.347035');
INSERT INTO public.configuracion_sistema (clave, valor, descripcion, tipo_dato, categoria, editable, iso_code_pais, activo, fecha_creacion, fecha_actualizacion) VALUES ('TIPO_CAMBIO_USD_PEN', '3.75', 'Tipo de cambio USD a PEN', 'STRING', 'FINANCIERO', true, NULL, true, '2025-08-26 15:16:04.347035', '2025-08-26 15:16:04.347035');
INSERT INTO public.configuracion_sistema (clave, valor, descripcion, tipo_dato, categoria, editable, iso_code_pais, activo, fecha_creacion, fecha_actualizacion) VALUES ('MARGEN_MINIMO', '15.00', 'Margen mínimo permitido (%)', 'STRING', 'COMERCIAL', true, NULL, true, '2025-08-26 15:16:04.347035', '2025-08-26 15:16:04.347035');
INSERT INTO public.configuracion_sistema (clave, valor, descripcion, tipo_dato, categoria, editable, iso_code_pais, activo, fecha_creacion, fecha_actualizacion) VALUES ('IGV_PORCENTAJE', '18.00', 'Porcentaje de IGV', 'STRING', 'IMPUESTOS', true, NULL, true, '2025-08-26 15:16:04.347035', '2025-08-26 15:16:04.347035');
INSERT INTO public.configuracion_sistema (clave, valor, descripcion, tipo_dato, categoria, editable, iso_code_pais, activo, fecha_creacion, fecha_actualizacion) VALUES ('DIAS_VALIDEZ_COTIZACION', '15', 'Días de validez de cotizaciones', 'STRING', 'COMERCIAL', true, NULL, true, '2025-08-26 15:16:04.347035', '2025-08-26 15:16:04.347035');


--
-- TOC entry 5636 (class 0 OID 68036)
-- Dependencies: 485
-- Data for Name: costos_operativos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5612 (class 0 OID 67527)
-- Dependencies: 461
-- Data for Name: cotizacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cotizacion (id, numero, fecha_emision, fecha_vencimiento, validez_dias, validez_oferta_dias, id_cliente, atencion, id_asesor_ventas, tipo_cambio_usd_pen, tipo_cambio_eur_pen, tipo_cambio_clp_pen, fecha_tipo_cambio, lugar_entrega, id_forma_pago, id_condiciones_comerciales, id_moneda_cotizacion, subtotal, subtotal_soles, descuento_total, igv, igv_soles, total, total_soles, porcentaje_igv, costo_total_proveedores, margen_bruto_total, porcentaje_margen_promedio, gastos_operativos, gastos_ventas, gastos_administrativos, gastos_financieros, utilidad_neta, utilidad_operativa, observaciones, observaciones_internas, activo, telefono_contacto, email_contacto, fecha_creacion, fecha_actualizacion, fecha_ultima_modificacion, creado_por, id_estado, id_disponibilidad) VALUES (14, '2025-C000001', '2025-09-22', '2025-09-29', 7, 7, 4, '', 3, 3.4940, 4.0880, NULL, '2025-09-22 17:45:37.648', '', 1, NULL, 1, 107.43, 107.43, 0.00, 19.34, 19.34, 126.77, 126.77, 18.00, NULL, NULL, NULL, 0.00, 0.00, 0.00, 0.00, NULL, NULL, '', '', true, '+51 963 381 909', 'ventas@inxora.com', '2025-09-22 17:45:39.144668', '2025-09-26 13:42:14.020011', '2025-09-24 20:47:25.68', NULL, 10, NULL);


--
-- TOC entry 5614 (class 0 OID 67596)
-- Dependencies: 463
-- Data for Name: cotizacion_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cotizacion_detalle (id, id_cotizacion, item, sku, descripcion_personalizada, cantidad, marca, unidad, precio_unitario_original, precio_unitario_soles, moneda_original, precio_unitario_convertido, descuento_unitario, descuento_porcentaje, precio_unitario_final, subtotal, precio_total_soles, id_proveedor_principal, id_proveedor, codigo_proveedor, precio_costo_proveedor, costo_unitario_proveedor, id_moneda_costo_proveedor, tipo_cambio_aplicado, tiempo_entrega_dias, tiempo_entrega_proveedor, margen_unitario, margen_total_linea, porcentaje_margen, notas_vendedor, notas_internas, activo, fecha_creacion) VALUES (9, 14, 2, 16, 'Aceite para Roscadora Dark RIDGID 70830', 1.000, 'RIDGID', 'UND', 40.76, 40.76, 'PEN', 40.76, 0.00, 0.00, 40.76, 40.76, 40.76, 19, 19, NULL, 31.79, 111.07, 2, 1.0000, 0, 0, -70.31, -70.31, -63.30, '', '', true, '2025-09-22 17:45:40.694827');


--
-- TOC entry 5608 (class 0 OID 67440)
-- Dependencies: 457
-- Data for Name: crm_actividad; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5565 (class 0 OID 66812)
-- Dependencies: 414
-- Data for Name: crm_etapa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.crm_etapa (id, nombre, descripcion, orden_secuencial, probabilidad_cierre_default, color_hex, es_etapa_final, es_exitosa, activo, fecha_creacion) VALUES (1, 'CONTACTO_INICIAL', 'Primer contacto establecido', 1, 5, '#6B7280', false, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.crm_etapa (id, nombre, descripcion, orden_secuencial, probabilidad_cierre_default, color_hex, es_etapa_final, es_exitosa, activo, fecha_creacion) VALUES (2, 'PROPUESTA', 'Propuesta enviada al cliente', 2, 25, '#3B82F6', false, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.crm_etapa (id, nombre, descripcion, orden_secuencial, probabilidad_cierre_default, color_hex, es_etapa_final, es_exitosa, activo, fecha_creacion) VALUES (3, 'NEGOCIACION', 'En proceso de negociación', 3, 60, '#F59E0B', false, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.crm_etapa (id, nombre, descripcion, orden_secuencial, probabilidad_cierre_default, color_hex, es_etapa_final, es_exitosa, activo, fecha_creacion) VALUES (4, 'CIERRE', 'Proceso de cierre de venta', 4, 85, '#22C55E', false, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.crm_etapa (id, nombre, descripcion, orden_secuencial, probabilidad_cierre_default, color_hex, es_etapa_final, es_exitosa, activo, fecha_creacion) VALUES (11, 'CALIFICADO', 'Prospect calificado con necesidad confirmada', 5, 40, '#8B5CF6', false, false, true, '2025-09-10 21:26:27.072481');
INSERT INTO public.crm_etapa (id, nombre, descripcion, orden_secuencial, probabilidad_cierre_default, color_hex, es_etapa_final, es_exitosa, activo, fecha_creacion) VALUES (12, 'PERDIDO', 'Oportunidad perdida', 6, 0, '#EF4444', true, false, true, '2025-09-10 21:26:27.072481');


--
-- TOC entry 5610 (class 0 OID 67490)
-- Dependencies: 459
-- Data for Name: crm_nota; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5630 (class 0 OID 67936)
-- Dependencies: 479
-- Data for Name: crowdlending_operacion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5624 (class 0 OID 67828)
-- Dependencies: 473
-- Data for Name: cuenta_por_cobrar; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5604 (class 0 OID 67369)
-- Dependencies: 453
-- Data for Name: detalle_solicitud_cotizacion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5595 (class 0 OID 67243)
-- Dependencies: 444
-- Data for Name: direccion_cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5549 (class 0 OID 66701)
-- Dependencies: 398
-- Data for Name: disponibilidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.disponibilidad (id, codigo, nombre, descripcion, color_hex, dias_entrega_min, dias_entrega_max, stock_requerido, activo, fecha_creacion) VALUES (1, 'INMEDIATO', 'INMEDIATO', 'Disponible en almacén Lima', '#6B7280', 0, 1, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.disponibilidad (id, codigo, nombre, descripcion, color_hex, dias_entrega_min, dias_entrega_max, stock_requerido, activo, fecha_creacion) VALUES (2, 'STOCK_LIMA', 'STOCK_LIMA', 'De 1 a 5 días - Entrega rápida', '#6B7280', 1, 5, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.disponibilidad (id, codigo, nombre, descripcion, color_hex, dias_entrega_min, dias_entrega_max, stock_requerido, activo, fecha_creacion) VALUES (3, 'IMPORTACION_RAPIDA', 'IMPORTACION_RAPIDA', 'De 10 a 20 días', '#6B7280', 10, 20, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.disponibilidad (id, codigo, nombre, descripcion, color_hex, dias_entrega_min, dias_entrega_max, stock_requerido, activo, fecha_creacion) VALUES (4, 'IMPORTACION_NORMAL', 'IMPORTACION_NORMAL', 'De 15 a 45 días', '#6B7280', 15, 45, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.disponibilidad (id, codigo, nombre, descripcion, color_hex, dias_entrega_min, dias_entrega_max, stock_requerido, activo, fecha_creacion) VALUES (5, 'BAJO_PEDIDO', 'BAJO_PEDIDO', 'De 60 a 120 días', '#6B7280', 60, 120, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.disponibilidad (id, codigo, nombre, descripcion, color_hex, dias_entrega_min, dias_entrega_max, stock_requerido, activo, fecha_creacion) VALUES (6, 'DESCONTINUADO', 'DESCONTINUADO', 'Producto descontinuado - Stock limitado', '#6B7280', 0, 60, false, false, '2025-08-26 15:16:04.347035');
INSERT INTO public.disponibilidad (id, codigo, nombre, descripcion, color_hex, dias_entrega_min, dias_entrega_max, stock_requerido, activo, fecha_creacion) VALUES (7, 'CONSULTAR', 'CONSULTAR', 'Disponibilidad a consultar con proveedor', '#6B7280', 1, 90, false, true, '2025-08-26 15:16:04.347035');


--
-- TOC entry 5543 (class 0 OID 66667)
-- Dependencies: 392
-- Data for Name: distrito; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (1, 'ANC', 'Ancón', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (2, 'ATE', 'Ate', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (3, 'BAR', 'Barranco', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (4, 'BRE', 'Breña', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (5, 'CAR', 'Carabayllo', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (6, 'CER', 'Cercado de Lima', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (7, 'CHA', 'Chaclacayo', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (8, 'CHO', 'Chorrillos', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (9, 'CIE', 'Cieneguilla', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (10, 'COM', 'Comas', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (11, 'AGU', 'El Agustino', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (12, 'IND', 'Independencia', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (13, 'JMA', 'Jesús María', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (14, 'MOL', 'La Molina', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (15, 'VIC', 'La Victoria', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (16, 'LIN', 'Lince', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (17, 'OLI', 'Los Olivos', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (18, 'LUR', 'Lurigancho-Chosica', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (19, 'LRI', 'Lurín', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (20, 'MAG', 'Magdalena del Mar', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (21, 'MIR', 'Miraflores', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (22, 'PAC', 'Pachacamac', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (23, 'PUC', 'Pucusana', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (24, 'PUE', 'Pueblo Libre', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (25, 'PPE', 'Puente Piedra', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (26, 'PHE', 'Punta Hermosa', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (27, 'PNE', 'Punta Negra', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (28, 'RIM', 'Rímac', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (29, 'SBA', 'San Bartolo', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (30, 'SBO', 'San Borja', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (31, 'SIS', 'San Isidro', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (32, 'SJL', 'San Juan de Lurigancho', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (33, 'SJM', 'San Juan de Miraflores', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (34, 'SLU', 'San Luis', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (35, 'SMP', 'San Martín de Porres', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (36, 'SMI', 'San Miguel', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (37, 'SAN', 'Santa Anita', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (38, 'SMM', 'Santa María del Mar', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (39, 'SRO', 'Santa Rosa', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (40, 'SUR', 'Santiago de Surco', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (41, 'SUQ', 'Surquillo', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (42, 'VES', 'Villa El Salvador', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');
INSERT INTO public.distrito (id, codigo, nombre, id_ciudad, codigo_postal, descripcion, activo, fecha_creacion) OVERRIDING SYSTEM VALUE VALUES (43, 'VMT', 'Villa María del Triunfo', 1, NULL, NULL, true, '2025-08-18 15:24:43.260842+00');


--
-- TOC entry 5572 (class 0 OID 66891)
-- Dependencies: 421
-- Data for Name: empresa_emisora; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.empresa_emisora (id, razon_social, nombre_comercial, ruc, direccion, ubigeo, telefono, email, id_pais, logo_url, certificado_digital, clave_sol, usuario_sol, activo, fecha_creacion) VALUES (1, 'INXORA S.A.C.', NULL, '20603436475', 'Av. Mariscal Oscar R. Benavides Nro. 3046', NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');


--
-- TOC entry 5643 (class 0 OID 86642)
-- Dependencies: 498
-- Data for Name: estado_cotizacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.estado_cotizacion (id, codigo, nombre, descripcion, color, activo, orden, created_at, updated_at, es_estado_final, es_exitoso) VALUES (7, 'GANADO', 'Ganado', 'Cotización ganada y convertida en venta', '#22C55E', true, 1, '2025-09-10 21:06:12.744495+00', '2025-09-11 14:04:43.864653+00', true, true);
INSERT INTO public.estado_cotizacion (id, codigo, nombre, descripcion, color, activo, orden, created_at, updated_at, es_estado_final, es_exitoso) VALUES (8, 'HOT', 'Hot', 'Cliente muy interesado, alta probabilidad de cierre', '#EF4444', true, 2, '2025-09-10 21:06:12.744495+00', '2025-09-11 14:04:43.864653+00', false, false);
INSERT INTO public.estado_cotizacion (id, codigo, nombre, descripcion, color, activo, orden, created_at, updated_at, es_estado_final, es_exitoso) VALUES (9, 'SEGUIMIENTO', 'Seguimiento', 'En proceso de seguimiento regular', '#F59E0B', true, 3, '2025-09-10 21:06:12.744495+00', '2025-09-11 14:04:43.864653+00', false, false);
INSERT INTO public.estado_cotizacion (id, codigo, nombre, descripcion, color, activo, orden, created_at, updated_at, es_estado_final, es_exitoso) VALUES (10, 'EVALUANDO', 'Evaluando', 'Cliente evaluando propuesta', '#3B82F6', true, 4, '2025-09-10 21:06:12.744495+00', '2025-09-11 14:04:43.864653+00', false, false);
INSERT INTO public.estado_cotizacion (id, codigo, nombre, descripcion, color, activo, orden, created_at, updated_at, es_estado_final, es_exitoso) VALUES (11, 'PERDIDO', 'Perdido', 'Cotización perdida o descartada', '#6B7280', true, 5, '2025-09-10 21:06:12.744495+00', '2025-09-11 14:04:43.864653+00', true, false);


--
-- TOC entry 5628 (class 0 OID 67918)
-- Dependencies: 477
-- Data for Name: factoring_operacion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5620 (class 0 OID 67743)
-- Dependencies: 469
-- Data for Name: factura; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5622 (class 0 OID 67802)
-- Dependencies: 471
-- Data for Name: factura_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5553 (class 0 OID 66729)
-- Dependencies: 402
-- Data for Name: forma_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.forma_pago (id, codigo, nombre, descripcion, dias_credito, comision_porcentaje, requiere_garantia, activo, fecha_creacion) VALUES (1, 'CONTADO', 'CONTADO', 'Pago al contado', 0, 0.00, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.forma_pago (id, codigo, nombre, descripcion, dias_credito, comision_porcentaje, requiere_garantia, activo, fecha_creacion) VALUES (2, 'DEPOSITO', 'DEPOSITO', 'Depósito bancario', 0, 0.00, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.forma_pago (id, codigo, nombre, descripcion, dias_credito, comision_porcentaje, requiere_garantia, activo, fecha_creacion) VALUES (3, 'CHEQUE', 'CHEQUE', 'Cheque al día', 0, 0.00, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.forma_pago (id, codigo, nombre, descripcion, dias_credito, comision_porcentaje, requiere_garantia, activo, fecha_creacion) VALUES (4, 'TARJETA_CREDITO', 'TARJETA_CREDITO', 'Tarjeta de crédito', 0, 3.50, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.forma_pago (id, codigo, nombre, descripcion, dias_credito, comision_porcentaje, requiere_garantia, activo, fecha_creacion) VALUES (5, 'TARJETA_DEBITO', 'TARJETA_DEBITO', 'Tarjeta de débito', 0, 1.50, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.forma_pago (id, codigo, nombre, descripcion, dias_credito, comision_porcentaje, requiere_garantia, activo, fecha_creacion) VALUES (6, 'CREDITO_30', 'CREDITO_30', 'Crédito a 30 días', 0, 0.00, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.forma_pago (id, codigo, nombre, descripcion, dias_credito, comision_porcentaje, requiere_garantia, activo, fecha_creacion) VALUES (7, 'CREDITO_60', 'CREDITO_60', 'Crédito a 60 días', 0, 0.00, false, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.forma_pago (id, codigo, nombre, descripcion, dias_credito, comision_porcentaje, requiere_garantia, activo, fecha_creacion) VALUES (8, 'CREDITO_90', 'CREDITO_90', 'Crédito a 90 días', 0, 0.00, false, true, '2025-08-26 15:16:04.347035');


--
-- TOC entry 5634 (class 0 OID 67991)
-- Dependencies: 483
-- Data for Name: historial_precios; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5638 (class 0 OID 68058)
-- Dependencies: 487
-- Data for Name: inversion_categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5561 (class 0 OID 66786)
-- Dependencies: 410
-- Data for Name: marca; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (1, 'SCHNEIDER', 'SCHNEIDER_ELECTRIC', 'Líder mundial en automatización y gestión de energía', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (2, 'SIEMENS', 'SIEMENS', 'Tecnología alemana para automatización industrial', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (3, 'ABB', 'ABB', 'Robótica y automatización suiza', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (4, 'FESTO', 'FESTO', 'Tecnología de automatización neumática alemana', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (6, 'FLUKE', 'FLUKE', 'Instrumentos de medición de precisión', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (8, 'OSRAM', 'OSRAM', 'Soluciones de iluminación industrial', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (9, 'SKF', 'SKF', 'Rodamientos y soluciones de rotación', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (11, 'PARKER', 'PARKER_HANNIFIN', 'Sistemas hidráulicos y neumáticos', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (12, 'EMERSON', 'EMERSON', 'Automatización y control de procesos', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (13, 'HONEYWELL', 'HONEYWELL', 'Tecnología industrial y sensores', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (14, 'GENERICO', 'GENERICO', 'Productos sin marca específica', NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (23, NULL, 'MITUTOYO', 'Instrumentos de medición y tecnología metrológica', NULL, NULL, NULL, true, '2025-09-19 21:15:07.353158');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (24, NULL, 'RIDGID', 'Herramientas profesionales para construcción, plomería y mantenimiento', NULL, NULL, NULL, true, '2025-09-19 21:16:40.339223');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (25, NULL, 'PHOENIX CONTACT', 'Electrificación, interconexión y automatización industrial', NULL, NULL, NULL, true, '2025-09-19 21:20:08.129453');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (26, NULL, 'BAHCO', NULL, NULL, NULL, NULL, true, '2025-09-22 17:01:46.663457');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (27, NULL, 'VENSO', NULL, NULL, NULL, NULL, true, '2025-09-23 15:12:53.870575');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (29, NULL, 'ABRO', NULL, NULL, NULL, NULL, true, '2025-09-23 15:13:19.141633');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (28, NULL, 'LOGTITE', NULL, NULL, NULL, NULL, true, '2025-09-23 15:13:04.469094');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (30, NULL, 'KMK', NULL, NULL, NULL, NULL, true, '2025-09-23 15:13:39.189824');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (31, NULL, 'VISTONY', NULL, NULL, NULL, NULL, true, '2025-09-23 15:13:47.244293');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (32, NULL, 'NTN', NULL, NULL, NULL, NULL, true, '2025-09-23 15:13:57.069603');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (33, NULL, 'FAG', NULL, NULL, NULL, NULL, true, '2025-09-23 15:14:03.339326');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (34, NULL, 'CONEXLED', NULL, NULL, NULL, NULL, true, '2025-09-23 15:14:56.852296');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (35, NULL, 'TRUPER', NULL, NULL, NULL, NULL, true, '2025-09-23 15:15:03.136895');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (36, NULL, 'STANLEY', NULL, NULL, NULL, NULL, true, '2025-09-23 15:15:14.408902');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (37, NULL, 'FEIM', NULL, NULL, NULL, NULL, true, '2025-09-23 15:15:23.469727');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (38, NULL, 'MILWAUKEE', NULL, NULL, NULL, NULL, true, '2025-09-23 15:16:08.010455');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (39, NULL, 'TOSCANO', NULL, NULL, NULL, NULL, true, '2025-09-23 15:34:59.028051');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (40, NULL, 'MAKITA', NULL, NULL, NULL, NULL, true, '2025-09-23 15:35:07.698371');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (41, NULL, 'WIHA', NULL, NULL, NULL, NULL, true, '2025-09-23 15:36:50.786004');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (42, NULL, 'VAINSA', NULL, NULL, NULL, NULL, true, '2025-09-23 15:37:16.127653');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (43, NULL, 'TEKOX', NULL, NULL, NULL, NULL, true, '2025-09-23 15:38:01.805485');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (44, NULL, 'DEWALT', NULL, NULL, NULL, NULL, true, '2025-09-23 15:39:24.311877');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (45, NULL, 'INDECO', NULL, NULL, NULL, NULL, true, '2025-09-23 15:40:16.914949');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (46, NULL, 'ROTOPLAS', NULL, NULL, NULL, NULL, true, '2025-09-23 15:40:31.883716');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (47, NULL, 'AMBROSOL', NULL, NULL, NULL, NULL, true, '2025-09-23 15:41:38.724128');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (48, NULL, 'CAB', NULL, NULL, NULL, NULL, true, '2025-09-23 15:41:58.210655');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (49, NULL, 'KARCHER', NULL, NULL, NULL, NULL, true, '2025-09-23 15:42:12.733624');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (50, NULL, 'BOSCH', NULL, NULL, NULL, NULL, true, '2025-09-23 15:43:30.635257');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (51, NULL, 'PERMATEX', NULL, NULL, NULL, NULL, true, '2025-09-23 15:43:43.682607');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (52, NULL, 'ABRALIT', NULL, NULL, NULL, NULL, true, '2025-09-23 15:44:20.328544');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (53, NULL, '3M', NULL, NULL, NULL, NULL, true, '2025-09-23 15:44:29.501221');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (54, NULL, 'NORTON', NULL, NULL, NULL, NULL, true, '2025-09-23 15:45:36.555946');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (55, NULL, 'FEIM', NULL, NULL, NULL, NULL, true, '2025-09-23 15:46:52.281871');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (56, NULL, 'KEPLER', NULL, NULL, NULL, NULL, true, '2025-09-23 15:48:09.887423');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (57, NULL, 'SOFAMEL', NULL, NULL, NULL, NULL, true, '2025-09-23 15:48:33.289522');
INSERT INTO public.marca (id, codigo, nombre, descripcion, logo_url, sitio_web, pais_origen, activo, fecha_creacion) VALUES (58, 'AGRA', 'AGRATOOLS', '', NULL, NULL, NULL, true, '2025-09-29 17:28:06.533583');


--
-- TOC entry 5581 (class 0 OID 67018)
-- Dependencies: 430
-- Data for Name: marca_categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (1, 1, false, true, '2025-09-01 21:03:36.655112');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (1, 2, false, true, '2025-09-01 21:03:36.655112');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (2, 2, false, true, '2025-09-01 21:03:36.655112');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (2, 3, false, true, '2025-09-01 21:03:36.655112');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (4, 4, false, true, '2025-09-01 21:03:36.655112');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (23, 5, false, true, '2025-09-19 21:43:50.067');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (24, 5, false, true, '2025-09-19 21:46:10.395');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (26, 5, false, true, '2025-09-22 17:02:06.177');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (3, 5, false, false, '2025-09-01 21:22:00.674');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (3, 10, false, false, '2025-09-01 21:21:58.634');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (3, 1, false, false, '2025-09-01 21:22:03.041');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (3, 2, false, false, '2025-09-01 21:03:36.655112');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (14, 6, false, true, '2025-09-23 16:22:30.905');
INSERT INTO public.marca_categoria (id_marca, id_categoria, es_especialista, activo, fecha_asociacion) VALUES (58, 5, false, true, '2025-09-29 17:28:23.442338');


--
-- TOC entry 5537 (class 0 OID 66615)
-- Dependencies: 386
-- Data for Name: moneda; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.moneda (id, codigo, nombre, simbolo, decimales, tasa_cambio, activo, es_principal, fecha_creacion, fecha_actualizacion) VALUES (1, 'PEN', 'Sol Peruano', 'S/', 2, 1.0000, true, true, '2025-07-30 20:36:22.402676', '2025-08-26 15:16:04.347035');
INSERT INTO public.moneda (id, codigo, nombre, simbolo, decimales, tasa_cambio, activo, es_principal, fecha_creacion, fecha_actualizacion) VALUES (2, 'USD', 'Dólar Americano', '$', 2, 1.0000, true, false, '2025-07-30 20:36:22.402676', '2025-08-26 15:16:04.347035');
INSERT INTO public.moneda (id, codigo, nombre, simbolo, decimales, tasa_cambio, activo, es_principal, fecha_creacion, fecha_actualizacion) VALUES (3, 'EUR', 'Euro', '€', 2, 1.0000, true, false, '2025-07-30 20:36:22.402676', '2025-08-26 15:16:04.347035');
INSERT INTO public.moneda (id, codigo, nombre, simbolo, decimales, tasa_cambio, activo, es_principal, fecha_creacion, fecha_actualizacion) VALUES (5, 'CNY', 'Yuan Chino', '¥', 2, 1.0000, true, false, '2025-07-31 14:15:40.060445', '2025-08-26 15:16:04.347035');


--
-- TOC entry 5606 (class 0 OID 67394)
-- Dependencies: 455
-- Data for Name: oportunidad; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5626 (class 0 OID 67872)
-- Dependencies: 475
-- Data for Name: pago_recibido; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5539 (class 0 OID 66631)
-- Dependencies: 388
-- Data for Name: pais; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pais (id, nombre, iso_code, iso_code_2, codigo, id_moneda_principal, prefijo_telefonico, codigo_telefono, moneda_local, nombre_doc_personal, nombre_doc_empresa, patron_telefono, patron_doc_personal, patron_doc_empresa, zona_horaria, activo, fecha_creacion) VALUES (1, 'Perú', 'PER', 'PE', 'PE', 1, '+51', NULL, NULL, 'DNI', 'RUC', NULL, NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.pais (id, nombre, iso_code, iso_code_2, codigo, id_moneda_principal, prefijo_telefonico, codigo_telefono, moneda_local, nombre_doc_personal, nombre_doc_empresa, patron_telefono, patron_doc_personal, patron_doc_empresa, zona_horaria, activo, fecha_creacion) VALUES (2, 'Estados Unidos', 'USA', 'US', 'US', 2, '+1', NULL, NULL, 'SSN', 'EIN', NULL, NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.pais (id, nombre, iso_code, iso_code_2, codigo, id_moneda_principal, prefijo_telefonico, codigo_telefono, moneda_local, nombre_doc_personal, nombre_doc_empresa, patron_telefono, patron_doc_personal, patron_doc_empresa, zona_horaria, activo, fecha_creacion) VALUES (3, 'España', 'ESP', 'ES', 'ES', 3, '+34', NULL, NULL, 'DNI', 'CIF', NULL, NULL, NULL, NULL, true, '2025-08-26 15:16:04.347035');


--
-- TOC entry 5616 (class 0 OID 67640)
-- Dependencies: 465
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5618 (class 0 OID 67710)
-- Dependencies: 467
-- Data for Name: pedido_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5602 (class 0 OID 67359)
-- Dependencies: 451
-- Data for Name: procesamiento_archivo_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5585 (class 0 OID 67074)
-- Dependencies: 434
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.producto (sku, sku_producto, cod_producto_marca, nombre, descripcion_corta, descripcion_detallada, especificaciones_tecnicas, aplicaciones, material, origen, id_categoria, id_marca, id_unidad, id_disponibilidad, peso_kg, dimensiones, volumen_m3, precio_referencia, id_moneda_referencia, margen_minimo, margen_sugerido, costo_proveedor, id_moneda_costo, ultimo_tipo_cambio, precio_venta, id_moneda_venta, margen_aplicado, id_proveedor_principal, requiere_stock, stock_minimo, punto_reorden, codigo_arancelario, es_importado, tiempo_importacion_dias, imagen_principal_url, galeria_imagenes_urls, seo_title, seo_description, seo_keywords, seo_slug, meta_robots, canonical_url, structured_data, seo_score, seo_optimizado, tags, es_destacado, es_novedad, es_promocion, activo, visible_web, requiere_aprobacion, fecha_creacion, fecha_actualizacion, creado_por, actualizado_por) VALUES (15, 'INXHERR001', '530-114', 'Calibrador Vernier Mitutoyo 530-114', 'El Calibrador Vernier Mitutoyo 530-114, también conocido como pie de rey, es un instrumento de
medición
de alta precisión diseñado para medir dimensiones externas, internas, profundidades y escalones
en piezas
mecánicas.', 'El Calibrador Vernier Mitutoyo 530-114, también conocido como pie de rey, es un instrumento de
medición
de alta precisión diseñado para medir dimensiones externas, internas, profundidades y escalones
en piezas
mecánicas. Fabricado por la reconocida marca japonesa Mitutoyo, es ampliamente utilizado en
talleres
mecánicos, laboratorios de metrología e industrias que requieren mediciones exactas.', '- Modelo: 530-114
- Marca: Mitutoyo
- Rango de medición: 0 - 200 mm (0 - 8")
- Resolución: 0,05 mm (1/128")
- Exactitud: ±0,05 mm
- Material: Acero inoxidable templado
- Acabado de la escala: Cromado satinado antideslumbrante
- Graduación: En desnivel para prevenir desgaste por fricción
- Tornillo de fijación: Ubicado en la parte superior para bloquear el cursor
- Varilla de profundidad: Plana
- Peso: 180 g
- Incluye: Estuche de protección
- País de origen: Japón', '- Medición de dimensiones externas e internas
- Medición de profundidades y escalones
Ventajas:
- Versatilidad y precisión
- Alta durabilidad
- Diseño ergonómico y fácil de usar', 'Acero inoxidable templado', 'Japón', 5, 23, 1, 1, 0.1800, '', NULL, NULL, NULL, 0.00, 15.00, 110.01, 2, 1.0000, 137.51, NULL, 20.00, 19, false, 0, 0, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'index,follow', NULL, NULL, 0, false, NULL, false, false, false, true, true, false, '2025-09-19 23:52:13.164307', '2025-09-19 23:52:13.164307', NULL, NULL);
INSERT INTO public.producto (sku, sku_producto, cod_producto_marca, nombre, descripcion_corta, descripcion_detallada, especificaciones_tecnicas, aplicaciones, material, origen, id_categoria, id_marca, id_unidad, id_disponibilidad, peso_kg, dimensiones, volumen_m3, precio_referencia, id_moneda_referencia, margen_minimo, margen_sugerido, costo_proveedor, id_moneda_costo, ultimo_tipo_cambio, precio_venta, id_moneda_venta, margen_aplicado, id_proveedor_principal, requiere_stock, stock_minimo, punto_reorden, codigo_arancelario, es_importado, tiempo_importacion_dias, imagen_principal_url, galeria_imagenes_urls, seo_title, seo_description, seo_keywords, seo_slug, meta_robots, canonical_url, structured_data, seo_score, seo_optimizado, tags, es_destacado, es_novedad, es_promocion, activo, visible_web, requiere_aprobacion, fecha_creacion, fecha_actualizacion, creado_por, actualizado_por) VALUES (16, 'INXHERR002', '70830', 'Aceite para Roscadora Dark RIDGID 70830', 'El Aceite para Roscadora Dark RIDGID 70830 es un lubricante mineral de alto rendimiento diseñado para
operaciones de roscado en tuberías y conexiones.', 'El Aceite para Roscadora Dark RIDGID 70830 es un lubricante mineral de alto rendimiento diseñado para
operaciones de roscado en tuberías y conexiones. Su formulación avanzada proporciona una excelente
lubricación y refrigeración durante el proceso de corte, lo que resulta en roscas de alta calidad y una mayor
vida útil de las herramientas.
Este aceite es de color oscuro, de bajo olor y está libre de cloro, halógenos, PCB y metales pesados, lo que
lo hace seguro para el usuario y el medio ambiente. Además, mantiene su viscosidad incluso a bajas
temperaturas, asegurando un rendimiento constante en diversas condiciones.', '- Marca: RIDGID
- Modelo: 70830
- Tipo de producto: Aceite de corte de rosca
- Color: Oscuro
- Olor: Bajo
- Contenido: 1 galón (3.78 litros)
- Viscosidad: 42.5 mm²/s a 40°C
- Punto de inflamación: 196°C (385°F)
- Densidad relativa: 0.878
- Libre de: Cloro, halógenos, PCB y metales pesados
- Temperatura de operación: Hasta 0°F (-17.8°C)
- Aplicaciones: Roscado de tuberías y conexiones

Ventajas
- Enfría las roscas y tuberías durante el funcionamiento, reduciendo el desgaste de las herramientas
- Acelera la eliminación de metal, mejorando la eficiencia del proceso de roscado
- Mejora la calidad de las roscas, asegurando un ajuste preciso y seguro
- Reduce el par de apriete necesario para el roscado
- Formulación de bajo olor y anti-vapor para un ambiente de trabajo más cómodo

', '- Roscado de tuberías y conexiones en instalaciones de plomería, gas y sistemas industriales
- Uso en máquinas roscadoras manuales y eléctricas
- Aplicaciones en talleres mecánicos, plantas industriales y obras de construcción', '', '', 5, 24, 9, 1, NULL, '', NULL, NULL, NULL, 0.00, 15.00, 31.79, 2, 1.0000, 40.76, NULL, 22.00, 19, false, 0, 0, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'index,follow', NULL, NULL, 0, false, NULL, false, false, false, true, true, false, '2025-09-20 00:04:08.349349', '2025-09-20 00:04:08.349349', NULL, NULL);
INSERT INTO public.producto (sku, sku_producto, cod_producto_marca, nombre, descripcion_corta, descripcion_detallada, especificaciones_tecnicas, aplicaciones, material, origen, id_categoria, id_marca, id_unidad, id_disponibilidad, peso_kg, dimensiones, volumen_m3, precio_referencia, id_moneda_referencia, margen_minimo, margen_sugerido, costo_proveedor, id_moneda_costo, ultimo_tipo_cambio, precio_venta, id_moneda_venta, margen_aplicado, id_proveedor_principal, requiere_stock, stock_minimo, punto_reorden, codigo_arancelario, es_importado, tiempo_importacion_dias, imagen_principal_url, galeria_imagenes_urls, seo_title, seo_description, seo_keywords, seo_slug, meta_robots, canonical_url, structured_data, seo_score, seo_optimizado, tags, es_destacado, es_novedad, es_promocion, activo, visible_web, requiere_aprobacion, fecha_creacion, fecha_actualizacion, creado_por, actualizado_por) VALUES (26, 'INXHERR003', 'BH110000A', 'GATO HIDRÁULICO EXTRA LARGO 10 TON BAHCO BH110000A – SERVICIO PESADO', 'El Bahco BH110000A es un gato hidráulico de carretilla extra largo de 10 toneladas diseñado
para servicio pesado en camiones, buses, maquinaria y flotas. Su chasis extendido ofrece
mayor alcance a puntos de apoyo alejados, mientras el sistema de elevación rápida (quick lift de
doble pistón) reduce los tiempos de operación. Construcción robusta, válvula de sobrecarga y
control de descenso preciso y progresivo para trabajos seguros en taller y campo.', 'Capacidad 10 t para vehículos pesados (buses, tractos, volquetes y maquinaria ligera).
Chasis extra largo: acceso cómodo a puntos de apoyo centrales o de difícil alcance.
Elevación rápida (doble pistón): menos bombeos hasta el contacto con la carga.
Control fino de descenso: válvula de descarga que permite bajar la carga de forma progresiva.
Válvula de seguridad (overload): protege el sistema frente a sobrecargas.
Ruedas de acero (delanteras fijas y traseras giratorias) para maniobra estable.
Mango de 2–3 secciones con agarre ergonómico y posición vertical para almacenaje.
Sello hidráulico de alta durabilidad y cuerpo reforzado para uso continuo.
Saddle / cabezal amplio (con pad de goma según versión) para mejor apoyo y menor daño al
punto de carga.', 'Marca / Modelo:
Bahco BH110000A
Tipo:
Gato hidráulico de carretilla extra largo
Capacidad nominal:
10 toneladas
Sistema de elevación:
Doble pistón (quick lift)
Rango de elevación:
Perfil bajo a elevación alta para servicio pesado (ver etiqueta)
Longitud del chasis:
Extra largo para mayor alcance bajo el vehículo
Material del chasis:
Acero estructural reforzado
Ruedas:
Acero – delanteras fijas / traseras giratorias
Válvulas:
Sobre■carga y control de descenso proporcional
Mango:
Secciones desmontables (2–3) con agarre ergonómico
Mantenimiento:
Engrase + revisión de nivel y estado del aceite hidráulico
Peso / dimensiones:
Uso profesional (variables según lote/versión)', 'Aplicaciones recomendadas
• Talleres de flota y transporte: elevación de camiones, semirremolques y buses.
• Mantenimiento minero y construcción: soporte para maquinaria pesada y equipos de obra.
• Centros de servicio y neumáticos: cambios de llantas, inspección de ejes y frenos.
• Servicios en campo: asistencia pesada donde se requiera alcance extra bajo el vehículo.
Buenas prácticas de uso
• Utilizar caballetes homologados para soportar la carga; no trabajar solo con el gato.
• Aplicar el gato únicamente en puntos de apoyo indicados por el fabricante del vehículo.
• Verificar superficie nivelada, activar freno de estacionamiento y colocar calzos.
• Mantener el equipo engrasado, con aceite hidráulico en nivel y sin fugas.
• No exceder la capacidad nominal de 10 t.
Los valores dimensionales exactos (altura mínima/máxima, recorrido y peso) pueden variar por lote o versión. Revise
la placa técnica del producto.', 'Acero estructural reforzado', '', 5, 26, 1, 1, NULL, 'Uso profesional (variables según lote/versión)', NULL, NULL, NULL, 0.00, 15.00, 977.23, 1, 1.0000, 1237.00, NULL, 21.00, 23, false, 0, 0, NULL, false, NULL, NULL, NULL, 'GATO HIDRÁULICO EXTRA LARGO 10 TON BAHCO BH110000A – SERV...', 'GATO HIDRÁULICO EXTRA LARGO 10 TON BAHCO BH110000A – SERVICIO PESADO BAHCO. El Bahco BH110000A es un .... Suministros industriales INXORA - Calidad garantizada.', 'gato, hidráulico, extra, largo, bahco, bh110000a, servicio, pesado, herramientas_maniobra, herramientas, equipos, maquinaria', 'bahco/gato-hidraulico-extra-largo-10-ton-bahco-bh110000a-servicio-pesado', 'index,follow', 'https://inxora.com/productos/bahco/gato-hidraulico-extra-largo-10-ton-bahco-bh110000a-servicio-pesado', NULL, 75, true, NULL, false, false, false, true, true, false, '2025-09-23 14:23:23.968066', '2025-09-25 19:25:32.027173', NULL, NULL);


--
-- TOC entry 5656 (class 0 OID 106228)
-- Dependencies: 515
-- Data for Name: producto_precio_moneda; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.producto_precio_moneda (id, sku, id_moneda, precio_venta, margen_aplicado, fecha_vigencia_desde, fecha_vigencia_hasta, activo, fecha_creacion, fecha_actualizacion, creado_por, actualizado_por, observaciones) VALUES (4, 15, 1, 137.51, 20.00, '2025-09-26', NULL, true, '2025-09-26 15:51:45.852068', '2025-09-26 15:51:45.852068', NULL, NULL, 'Migrado desde tabla producto');
INSERT INTO public.producto_precio_moneda (id, sku, id_moneda, precio_venta, margen_aplicado, fecha_vigencia_desde, fecha_vigencia_hasta, activo, fecha_creacion, fecha_actualizacion, creado_por, actualizado_por, observaciones) VALUES (5, 16, 1, 40.76, 22.00, '2025-09-26', NULL, true, '2025-09-26 15:51:45.852068', '2025-09-26 15:51:45.852068', NULL, NULL, 'Migrado desde tabla producto');
INSERT INTO public.producto_precio_moneda (id, sku, id_moneda, precio_venta, margen_aplicado, fecha_vigencia_desde, fecha_vigencia_hasta, activo, fecha_creacion, fecha_actualizacion, creado_por, actualizado_por, observaciones) VALUES (6, 26, 1, 1237.00, 21.00, '2025-09-26', NULL, true, '2025-09-26 15:51:45.852068', '2025-09-26 15:51:45.852068', NULL, NULL, 'Migrado desde tabla producto');


--
-- TOC entry 5587 (class 0 OID 67155)
-- Dependencies: 436
-- Data for Name: producto_proveedor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.producto_proveedor (id, sku, id_proveedor, codigo_proveedor, precio_costo, id_moneda_costo, tiempo_entrega_dias, stock_disponible, minimo_pedido, es_proveedor_principal, margen_aplicado, fecha_ultima_cotizacion, observaciones, activo, fecha_creacion, fecha_actualizacion, precio_incluye_igv) VALUES (14, 15, 19, NULL, 110.01, 2, 0, 0, 1.000, true, NULL, NULL, NULL, true, '2025-09-19 23:52:13.536505', '2025-09-19 23:52:13.536505', false);
INSERT INTO public.producto_proveedor (id, sku, id_proveedor, codigo_proveedor, precio_costo, id_moneda_costo, tiempo_entrega_dias, stock_disponible, minimo_pedido, es_proveedor_principal, margen_aplicado, fecha_ultima_cotizacion, observaciones, activo, fecha_creacion, fecha_actualizacion, precio_incluye_igv) VALUES (15, 16, 19, NULL, 31.79, 2, 0, 0, 1.000, true, NULL, NULL, NULL, true, '2025-09-20 00:04:08.776195', '2025-09-20 00:04:08.776195', false);
INSERT INTO public.producto_proveedor (id, sku, id_proveedor, codigo_proveedor, precio_costo, id_moneda_costo, tiempo_entrega_dias, stock_disponible, minimo_pedido, es_proveedor_principal, margen_aplicado, fecha_ultima_cotizacion, observaciones, activo, fecha_creacion, fecha_actualizacion, precio_incluye_igv) VALUES (19, 26, 23, NULL, 977.23, 1, 0, 0, 1.000, true, NULL, NULL, NULL, true, '2025-09-23 14:23:24.462262', '2025-09-23 14:23:24.462262', false);


--
-- TOC entry 5589 (class 0 OID 67188)
-- Dependencies: 438
-- Data for Name: promocion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5591 (class 0 OID 67208)
-- Dependencies: 440
-- Data for Name: promocion_descuento; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5593 (class 0 OID 67224)
-- Dependencies: 442
-- Data for Name: promocion_uso; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5574 (class 0 OID 66909)
-- Dependencies: 423
-- Data for Name: proveedor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.proveedor (id, codigo, razon_social, nombre_comercial, documento_empresa, tipo_documento, nombre_contacto, apellidos_contacto, correo, correo_facturacion, telefono, whatsapp, direccion, id_ciudad, id_pais, sitio_web, soporte_productos, entrega_nacional, entrega_internacional, margen_negociado, dias_pago_promedio, id_condiciones_comerciales, activo, fecha_registro, ultima_cotizacion, notas_internas) VALUES (23, NULL, 'SIERSAC', NULL, 'SIERSAC', 'RUC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, false, true, false, NULL, 30, NULL, true, '2025-09-22 21:57:07.347639', NULL, NULL);
INSERT INTO public.proveedor (id, codigo, razon_social, nombre_comercial, documento_empresa, tipo_documento, nombre_contacto, apellidos_contacto, correo, correo_facturacion, telefono, whatsapp, direccion, id_ciudad, id_pais, sitio_web, soporte_productos, entrega_nacional, entrega_internacional, margen_negociado, dias_pago_promedio, id_condiciones_comerciales, activo, fecha_registro, ultima_cotizacion, notas_internas) VALUES (20, NULL, 'SIERSAC', 'SIERSAC', NULL, 'RUC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, false, true, false, NULL, 30, NULL, true, '2025-09-22 17:16:19.842055', NULL, NULL);
INSERT INTO public.proveedor (id, codigo, razon_social, nombre_comercial, documento_empresa, tipo_documento, nombre_contacto, apellidos_contacto, correo, correo_facturacion, telefono, whatsapp, direccion, id_ciudad, id_pais, sitio_web, soporte_productos, entrega_nacional, entrega_internacional, margen_negociado, dias_pago_promedio, id_condiciones_comerciales, activo, fecha_registro, ultima_cotizacion, notas_internas) VALUES (19, NULL, 'FESEPSA', 'FESEPSA', NULL, 'RUC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, false, true, false, NULL, 30, NULL, true, '2025-09-19 22:29:22.30786', NULL, NULL);
INSERT INTO public.proveedor (id, codigo, razon_social, nombre_comercial, documento_empresa, tipo_documento, nombre_contacto, apellidos_contacto, correo, correo_facturacion, telefono, whatsapp, direccion, id_ciudad, id_pais, sitio_web, soporte_productos, entrega_nacional, entrega_internacional, margen_negociado, dias_pago_promedio, id_condiciones_comerciales, activo, fecha_registro, ultima_cotizacion, notas_internas) VALUES (3, NULL, 'TUBOS Y ACCESORIOS DEL PERÚ SA', 'TAPSA', '20345678903', 'RUC', NULL, NULL, 'ventas@tapsa.com.pe', NULL, '+51016789012', NULL, NULL, NULL, 1, NULL, false, true, false, NULL, 30, NULL, true, '2025-09-10 15:53:17.701059', NULL, NULL);
INSERT INTO public.proveedor (id, codigo, razon_social, nombre_comercial, documento_empresa, tipo_documento, nombre_contacto, apellidos_contacto, correo, correo_facturacion, telefono, whatsapp, direccion, id_ciudad, id_pais, sitio_web, soporte_productos, entrega_nacional, entrega_internacional, margen_negociado, dias_pago_promedio, id_condiciones_comerciales, activo, fecha_registro, ultima_cotizacion, notas_internas) VALUES (2, NULL, 'MATERIALES INDUSTRIALES EIRL', 'MATINSA', '20234567892', 'RUC', NULL, NULL, 'cotizaciones@matinsa.pe', NULL, '+51015678901', NULL, NULL, NULL, 1, NULL, false, true, false, NULL, 30, NULL, true, '2025-09-10 15:53:17.701059', NULL, NULL);
INSERT INTO public.proveedor (id, codigo, razon_social, nombre_comercial, documento_empresa, tipo_documento, nombre_contacto, apellidos_contacto, correo, correo_facturacion, telefono, whatsapp, direccion, id_ciudad, id_pais, sitio_web, soporte_productos, entrega_nacional, entrega_internacional, margen_negociado, dias_pago_promedio, id_condiciones_comerciales, activo, fecha_registro, ultima_cotizacion, notas_internas) VALUES (1, NULL, 'DISTRIBUIDORA ELÉCTRICA SAC', 'DISELEC', '20123456781', 'RUC', NULL, NULL, 'ventas@diselec.com.pe', NULL, '+51014567890', NULL, NULL, NULL, 1, NULL, false, true, false, NULL, 30, NULL, true, '2025-09-10 15:53:17.701059', NULL, NULL);
INSERT INTO public.proveedor (id, codigo, razon_social, nombre_comercial, documento_empresa, tipo_documento, nombre_contacto, apellidos_contacto, correo, correo_facturacion, telefono, whatsapp, direccion, id_ciudad, id_pais, sitio_web, soporte_productos, entrega_nacional, entrega_internacional, margen_negociado, dias_pago_promedio, id_condiciones_comerciales, activo, fecha_registro, ultima_cotizacion, notas_internas) VALUES (24, NULL, 'VENSO', 'VENSO (VENSO PERU)', NULL, 'RUC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, false, true, false, NULL, 30, 1, true, '2025-09-23 19:10:45.757149', NULL, NULL);
INSERT INTO public.proveedor (id, codigo, razon_social, nombre_comercial, documento_empresa, tipo_documento, nombre_contacto, apellidos_contacto, correo, correo_facturacion, telefono, whatsapp, direccion, id_ciudad, id_pais, sitio_web, soporte_productos, entrega_nacional, entrega_internacional, margen_negociado, dias_pago_promedio, id_condiciones_comerciales, activo, fecha_registro, ultima_cotizacion, notas_internas) VALUES (25, NULL, 'VANTOOLS', NULL, 'VANTOOLS', 'RUC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, false, true, false, NULL, 30, NULL, true, '2025-09-29 17:37:30.104552', NULL, NULL);


--
-- TOC entry 5583 (class 0 OID 67055)
-- Dependencies: 432
-- Data for Name: proveedor_categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5582 (class 0 OID 67036)
-- Dependencies: 431
-- Data for Name: proveedor_marca; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.proveedor_marca (id_proveedor, id_marca, es_distribuidor_oficial, descuento_especial, fecha_asociacion, activo) VALUES (23, 26, false, 0.00, '2025-09-22 21:57:07.58898', true);
INSERT INTO public.proveedor_marca (id_proveedor, id_marca, es_distribuidor_oficial, descuento_especial, fecha_asociacion, activo) VALUES (24, 27, false, 0.00, '2025-09-23 19:10:45.926613', true);
INSERT INTO public.proveedor_marca (id_proveedor, id_marca, es_distribuidor_oficial, descuento_especial, fecha_asociacion, activo) VALUES (25, 58, false, 0.00, '2025-09-29 17:37:30.474739', true);
INSERT INTO public.proveedor_marca (id_proveedor, id_marca, es_distribuidor_oficial, descuento_especial, fecha_asociacion, activo) VALUES (25, 35, false, 0.00, '2025-09-29 17:37:30.474739', true);


--
-- TOC entry 5576 (class 0 OID 66947)
-- Dependencies: 425
-- Data for Name: recogedores; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5545 (class 0 OID 66682)
-- Dependencies: 394
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rol (id, nombre, descripcion, activo, fecha_creacion) VALUES (1, 'SUPER_ADMIN', 'Acceso total al sistema - Root', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rol (id, nombre, descripcion, activo, fecha_creacion) VALUES (2, 'CONTADOR', 'Gestión de Compras, Ventas y Gastos', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rol (id, nombre, descripcion, activo, fecha_creacion) VALUES (3, 'DESARROLLADOR', 'Acceso para testing y desarrollo', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rol (id, nombre, descripcion, activo, fecha_creacion) VALUES (4, 'INVERSIONISTA', 'Gestión de inversiones y cobranzas', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rol (id, nombre, descripcion, activo, fecha_creacion) VALUES (5, 'VENDEDOR', 'Cotizaciones, facturación y despachos', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rol (id, nombre, descripcion, activo, fecha_creacion) VALUES (6, 'DESPACHADOR', 'Recojo y despacho de productos', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rol (id, nombre, descripcion, activo, fecha_creacion) VALUES (7, 'MARKETING', 'E-Commerce y gestión publicitaria', true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rol (id, nombre, descripcion, activo, fecha_creacion) VALUES (8, 'ADMINISTRADOR', 'Indicadores financieros y estados contables', true, '2025-08-26 15:16:04.347035');


--
-- TOC entry 5557 (class 0 OID 66764)
-- Dependencies: 406
-- Data for Name: rubro; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (1, 'AGROINDUSTRIA', 'AGROINDUSTRIA', 'Procesamiento de alimentos, agricultura tecnificada', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (2, 'MANUFACTURA', 'MANUFACTURA', 'Fabricación industrial, ensamblaje, producción', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (3, 'MINERIA', 'MINERIA', 'Extracción minera, procesamiento de minerales', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (4, 'ENERGIA', 'ENERGIA', 'Generación eléctrica, petróleo, gas, renovables', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (5, 'CONSTRUCCION', 'CONSTRUCCION', 'Construcción civil, infraestructura, edificación', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (6, 'TEXTIL', 'TEXTIL', 'Industria textil, confecciones, acabados', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (7, 'QUIMICA', 'QUIMICA', 'Industria química, farmacéutica, petroquímica', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (8, 'AUTOMOTRIZ', 'AUTOMOTRIZ', 'Ensamblaje vehicular, autopartes, talleres', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (9, 'METALMECANICA', 'METALMECANICA', 'Metalmecánica, soldadura, mecanizado', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (10, 'NAVAL', 'NAVAL', 'Astilleros, reparación naval, industria marítima', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (11, 'PAPEL_CARTON', 'PAPEL_CARTON', 'Industria papelera, empaques, cartones', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (12, 'PLASTICOS', 'PLASTICOS', 'Industria del plástico, inyección, soplado', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (13, 'VIDRIO_CERAMICA', 'VIDRIO_CERAMICA', 'Industria del vidrio, cerámica industrial', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (14, 'SERVICIOS_IND', 'SERVICIOS_INDUSTRIALES', 'Mantenimiento industrial, servicios técnicos', NULL, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.rubro (id, codigo, nombre, descripcion, sector_economico, activo, fecha_creacion) VALUES (15, 'OTROS', 'OTROS', 'Otros rubros no especificados', NULL, true, '2025-08-26 15:16:04.347035');


--
-- TOC entry 5600 (class 0 OID 67345)
-- Dependencies: 449
-- Data for Name: solicitud_archivo; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5597 (class 0 OID 67278)
-- Dependencies: 446
-- Data for Name: solicitud_cotizacion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5547 (class 0 OID 66693)
-- Dependencies: 396
-- Data for Name: tipo_cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tipo_cliente (id, nombre, descripcion) VALUES (1, 'PERSONA_NATURAL', 'Cliente persona natural');
INSERT INTO public.tipo_cliente (id, nombre, descripcion) VALUES (2, 'EMPRESA', 'Cliente empresa');


--
-- TOC entry 5645 (class 0 OID 89061)
-- Dependencies: 500
-- Data for Name: tipo_contacto; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tipo_contacto (id, codigo, nombre, descripcion, color, orden_secuencial, permite_cotizar, activo, fecha_creacion) VALUES (1, 'CLIENTE', 'Cliente', 'Cliente activo que ya realizó compras', '#22C55E', 1, true, true, '2025-09-10 21:26:27.072481');
INSERT INTO public.tipo_contacto (id, codigo, nombre, descripcion, color, orden_secuencial, permite_cotizar, activo, fecha_creacion) VALUES (2, 'PROSPECTO', 'Prospecto', 'Cliente potencial en proceso de evaluación', '#3B82F6', 2, true, true, '2025-09-10 21:26:27.072481');
INSERT INTO public.tipo_contacto (id, codigo, nombre, descripcion, color, orden_secuencial, permite_cotizar, activo, fecha_creacion) VALUES (3, 'DESCARTADO', 'Descartado', 'Contacto descartado o sin interés', '#6B7280', 3, false, true, '2025-09-10 21:26:27.072481');


--
-- TOC entry 5647 (class 0 OID 90344)
-- Dependencies: 502
-- Data for Name: transicion_estado_cotizacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transicion_estado_cotizacion (id, id_cotizacion, estado_anterior_id, estado_nuevo_id, motivo, observaciones, probabilidad_anterior, probabilidad_nueva, valor_estimado, fecha_transicion, dias_en_estado_anterior, usuario_responsable, automatico, ip_origen, user_agent, canal_origen, valor_cotizacion_momento, margen_estimado, created_at, updated_at) VALUES (16, 14, NULL, 10, NULL, 'Estado inicial de la cotización', NULL, NULL, 126.77, '2025-09-22 17:45:39.144668', 0, 3, true, NULL, NULL, NULL, 126.77, NULL, '2025-09-22 17:45:39.144668', '2025-09-22 17:45:39.144668');
INSERT INTO public.transicion_estado_cotizacion (id, id_cotizacion, estado_anterior_id, estado_nuevo_id, motivo, observaciones, probabilidad_anterior, probabilidad_nueva, valor_estimado, fecha_transicion, dias_en_estado_anterior, usuario_responsable, automatico, ip_origen, user_agent, canal_origen, valor_cotizacion_momento, margen_estimado, created_at, updated_at) VALUES (17, 14, 10, 9, NULL, 'Transición automática registrada por trigger del sistema', NULL, NULL, 126.77, '2025-09-24 20:47:22.998586', 2, 3, true, NULL, NULL, NULL, 126.77, NULL, '2025-09-24 20:47:22.998586', '2025-09-24 20:47:22.998586');
INSERT INTO public.transicion_estado_cotizacion (id, id_cotizacion, estado_anterior_id, estado_nuevo_id, motivo, observaciones, probabilidad_anterior, probabilidad_nueva, valor_estimado, fecha_transicion, dias_en_estado_anterior, usuario_responsable, automatico, ip_origen, user_agent, canal_origen, valor_cotizacion_momento, margen_estimado, created_at, updated_at) VALUES (18, 14, 10, 9, NULL, NULL, NULL, NULL, NULL, '2025-09-24 20:47:22.872', 0, 1, false, NULL, NULL, NULL, 126.77, NULL, '2025-09-24 20:47:23.162379', '2025-09-24 20:47:23.162379');
INSERT INTO public.transicion_estado_cotizacion (id, id_cotizacion, estado_anterior_id, estado_nuevo_id, motivo, observaciones, probabilidad_anterior, probabilidad_nueva, valor_estimado, fecha_transicion, dias_en_estado_anterior, usuario_responsable, automatico, ip_origen, user_agent, canal_origen, valor_cotizacion_momento, margen_estimado, created_at, updated_at) VALUES (19, 14, 9, 10, NULL, 'Transición automática registrada por trigger del sistema', NULL, NULL, 126.77, '2025-09-24 20:47:25.94986', 0, 3, true, NULL, NULL, NULL, 126.77, NULL, '2025-09-24 20:47:25.94986', '2025-09-24 20:47:25.94986');
INSERT INTO public.transicion_estado_cotizacion (id, id_cotizacion, estado_anterior_id, estado_nuevo_id, motivo, observaciones, probabilidad_anterior, probabilidad_nueva, valor_estimado, fecha_transicion, dias_en_estado_anterior, usuario_responsable, automatico, ip_origen, user_agent, canal_origen, valor_cotizacion_momento, margen_estimado, created_at, updated_at) VALUES (20, 14, 9, 10, NULL, NULL, NULL, NULL, NULL, '2025-09-24 20:47:25.815', 0, 1, false, NULL, NULL, NULL, 126.77, NULL, '2025-09-24 20:47:26.074802', '2025-09-24 20:47:26.074802');


--
-- TOC entry 5551 (class 0 OID 66716)
-- Dependencies: 400
-- Data for Name: unidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (1, 'UND', 'UNIDAD', 'UND', 'CANTIDAD', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (2, 'PZA', 'PIEZA', 'PZA', 'CANTIDAD', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (3, 'M', 'METRO', 'M', 'LONGITUD', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (4, 'M2', 'METRO_CUADRADO', 'M2', 'AREA', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (5, 'M3', 'METRO_CUBICO', 'M3', 'VOLUMEN', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (6, 'KG', 'KILOGRAMO', 'KG', 'PESO', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (7, 'GR', 'GRAMO', 'GR', 'PESO', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (8, 'LT', 'LITRO', 'LT', 'VOLUMEN', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (9, 'GAL', 'GALON', 'GAL', 'VOLUMEN', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (10, 'CJA', 'CAJA', 'CJA', 'EMPAQUE', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (11, 'PKT', 'PAQUETE', 'PKT', 'EMPAQUE', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (12, 'RLL', 'ROLLO', 'RLL', 'EMPAQUE', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (13, 'JGO', 'JUEGO', 'JGO', 'CONJUNTO', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (14, 'KIT', 'KIT', 'KIT', 'CONJUNTO', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (15, 'PAR', 'PAR', 'PAR', 'CONJUNTO', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (16, 'DOC', 'DOCENA', 'DOC', 'CANTIDAD', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (17, 'CNT', 'CENTENA', 'CNT', 'CANTIDAD', 1.0000, true, '2025-08-26 15:16:04.347035');
INSERT INTO public.unidad (id, codigo, nombre, simbolo, tipo, factor_conversion_base, activo, fecha_creacion) VALUES (18, 'MLL', 'MILLAR', 'MLL', 'CANTIDAD', 1.0000, true, '2025-08-26 15:16:04.347035');


--
-- TOC entry 5566 (class 0 OID 66826)
-- Dependencies: 415
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuario (id, nombre, apellidos, correo, es_asesor_ventas, telefono_directo, email_comercial, firma_comercial, activo, auth_user_id, fecha_creacion, fecha_actualizacion) VALUES (1, 'Ruth', 'Peña', 'rpena@inxora.com', false, NULL, NULL, NULL, true, '82df97ec-0c85-495e-b673-31c03757603b', '2025-08-26 15:29:52.412652', '2025-08-26 15:29:52.412652');
INSERT INTO public.usuario (id, nombre, apellidos, correo, es_asesor_ventas, telefono_directo, email_comercial, firma_comercial, activo, auth_user_id, fecha_creacion, fecha_actualizacion) VALUES (2, 'Roberto', 'Aponte', 'raponte@inxora.com', false, NULL, NULL, NULL, true, '36e6097c-3167-4a35-8d22-c5036418c0d5', '2025-09-10 21:44:47.791536', '2025-09-10 21:44:47.791536');
INSERT INTO public.usuario (id, nombre, apellidos, correo, es_asesor_ventas, telefono_directo, email_comercial, firma_comercial, activo, auth_user_id, fecha_creacion, fecha_actualizacion) VALUES (4, 'Dulce', 'La Torre', 'dlatorre@inxora.com', false, NULL, NULL, NULL, true, '60bc1460-6cbf-48b0-937c-eb2322ca1cbc', '2025-09-10 21:51:35.239411', '2025-09-10 21:51:35.239411');
INSERT INTO public.usuario (id, nombre, apellidos, correo, es_asesor_ventas, telefono_directo, email_comercial, firma_comercial, activo, auth_user_id, fecha_creacion, fecha_actualizacion) VALUES (6, 'Noe', 'Mantilla', 'nmantilla@inxora.com', false, NULL, NULL, NULL, true, '2c387ed4-e734-46d0-ad85-666fa04a6c69', '2025-09-10 21:56:32.92662', '2025-09-10 21:56:32.92662');
INSERT INTO public.usuario (id, nombre, apellidos, correo, es_asesor_ventas, telefono_directo, email_comercial, firma_comercial, activo, auth_user_id, fecha_creacion, fecha_actualizacion) VALUES (3, 'Jorge', 'Huamani', 'jhuamani@inxora.com', true, NULL, NULL, NULL, true, '36e6097c-3167-4a35-8d22-c5036418c0d5', '2025-09-10 21:49:47.144043', '2025-09-11 17:22:52.874593');
INSERT INTO public.usuario (id, nombre, apellidos, correo, es_asesor_ventas, telefono_directo, email_comercial, firma_comercial, activo, auth_user_id, fecha_creacion, fecha_actualizacion) VALUES (5, 'Zenyu', 'Varas', 'zvaras@inxora.com', true, NULL, NULL, NULL, true, '5ed36a9e-5329-4b84-a3f0-7e8b9a01be5b', '2025-09-10 21:55:19.671021', '2025-09-11 17:22:56.21783');


--
-- TOC entry 5568 (class 0 OID 66838)
-- Dependencies: 417
-- Data for Name: usuario_rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuario_rol (id, id_usuario, id_rol, fecha_asignacion, asignado_por, activo) VALUES (2, 2, 1, '2025-09-10 21:44:47.791536', NULL, true);
INSERT INTO public.usuario_rol (id, id_usuario, id_rol, fecha_asignacion, asignado_por, activo) VALUES (3, 3, 5, '2025-09-10 21:50:25.313722', NULL, true);
INSERT INTO public.usuario_rol (id, id_usuario, id_rol, fecha_asignacion, asignado_por, activo) VALUES (4, 4, 7, '2025-09-10 21:51:35.239411', NULL, true);
INSERT INTO public.usuario_rol (id, id_usuario, id_rol, fecha_asignacion, asignado_por, activo) VALUES (5, 5, 5, '2025-09-10 21:55:19.671021', NULL, true);
INSERT INTO public.usuario_rol (id, id_usuario, id_rol, fecha_asignacion, asignado_por, activo) VALUES (6, 6, 6, '2025-09-10 21:56:32.92662', NULL, true);
INSERT INTO public.usuario_rol (id, id_usuario, id_rol, fecha_asignacion, asignado_por, activo) VALUES (1, 1, 1, '2025-08-26 15:29:52.412652', NULL, true);


--
-- TOC entry 5563 (class 0 OID 66799)
-- Dependencies: 412
-- Data for Name: vehicle_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vehicle_types (id, nombre, descripcion, capacidad_carga_kg, capacidad_volumen_m3, activo, fecha_creacion, updated_at) OVERRIDING SYSTEM VALUE VALUES (1, 'Camión', 'Camión de carga grande', NULL, NULL, true, '2025-08-18 14:43:11.896569+00', '2025-08-18 14:43:11.896569+00');
INSERT INTO public.vehicle_types (id, nombre, descripcion, capacidad_carga_kg, capacidad_volumen_m3, activo, fecha_creacion, updated_at) OVERRIDING SYSTEM VALUE VALUES (2, 'Minivan', 'Vehículo utilitario compacto', NULL, NULL, true, '2025-08-18 14:43:11.896569+00', '2025-08-18 14:43:11.896569+00');
INSERT INTO public.vehicle_types (id, nombre, descripcion, capacidad_carga_kg, capacidad_volumen_m3, activo, fecha_creacion, updated_at) OVERRIDING SYSTEM VALUE VALUES (3, 'Moto', 'Motocicleta de carga', NULL, NULL, true, '2025-08-18 14:43:11.896569+00', '2025-08-18 14:43:11.896569+00');
INSERT INTO public.vehicle_types (id, nombre, descripcion, capacidad_carga_kg, capacidad_volumen_m3, activo, fecha_creacion, updated_at) OVERRIDING SYSTEM VALUE VALUES (4, 'Camioneta', 'Vehículo pickup', NULL, NULL, true, '2025-08-18 14:43:11.896569+00', '2025-08-18 14:43:11.896569+00');
INSERT INTO public.vehicle_types (id, nombre, descripcion, capacidad_carga_kg, capacidad_volumen_m3, activo, fecha_creacion, updated_at) OVERRIDING SYSTEM VALUE VALUES (5, 'Triciclo', 'Triciclo de carga', NULL, NULL, true, '2025-08-18 14:43:11.896569+00', '2025-08-18 14:43:11.896569+00');


--
-- TOC entry 5648 (class 0 OID 97132)
-- Dependencies: 507
-- Data for Name: messages_2025_09_22; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 5649 (class 0 OID 102118)
-- Dependencies: 508
-- Data for Name: messages_2025_09_23; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 5650 (class 0 OID 102129)
-- Dependencies: 509
-- Data for Name: messages_2025_09_24; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 5651 (class 0 OID 102140)
-- Dependencies: 510
-- Data for Name: messages_2025_09_25; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 5652 (class 0 OID 102252)
-- Dependencies: 511
-- Data for Name: messages_2025_09_26; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 5653 (class 0 OID 102367)
-- Dependencies: 512
-- Data for Name: messages_2025_09_27; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 5654 (class 0 OID 105112)
-- Dependencies: 513
-- Data for Name: messages_2025_09_28; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 5530 (class 0 OID 17003)
-- Dependencies: 375
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116024918, '2025-08-25 13:53:38');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116045059, '2025-08-25 13:53:42');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116050929, '2025-08-25 13:53:46');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116051442, '2025-08-25 13:53:49');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116212300, '2025-08-25 13:53:53');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116213355, '2025-08-25 13:53:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116213934, '2025-08-25 13:54:00');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116214523, '2025-08-25 13:54:04');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211122062447, '2025-08-25 13:54:08');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211124070109, '2025-08-25 13:54:11');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211202204204, '2025-08-25 13:54:15');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211202204605, '2025-08-25 13:54:18');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211210212804, '2025-08-25 13:54:28');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211228014915, '2025-08-25 13:54:32');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220107221237, '2025-08-25 13:54:35');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220228202821, '2025-08-25 13:54:38');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220312004840, '2025-08-25 13:54:42');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220603231003, '2025-08-25 13:54:47');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220603232444, '2025-08-25 13:54:50');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220615214548, '2025-08-25 13:54:54');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220712093339, '2025-08-25 13:54:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220908172859, '2025-08-25 13:55:01');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220916233421, '2025-08-25 13:55:04');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230119133233, '2025-08-25 13:55:08');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230128025114, '2025-08-25 13:55:12');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230128025212, '2025-08-25 13:55:16');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230227211149, '2025-08-25 13:55:19');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230228184745, '2025-08-25 13:55:22');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230308225145, '2025-08-25 13:55:26');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230328144023, '2025-08-25 13:55:29');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231018144023, '2025-08-25 13:55:33');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144023, '2025-08-25 13:55:38');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144024, '2025-08-25 13:55:41');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144025, '2025-08-25 13:55:45');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240108234812, '2025-08-25 13:55:48');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240109165339, '2025-08-25 13:55:51');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240227174441, '2025-08-25 13:55:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240311171622, '2025-08-25 13:56:02');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240321100241, '2025-08-25 13:56:09');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240401105812, '2025-08-25 13:56:18');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240418121054, '2025-08-25 13:56:23');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240523004032, '2025-08-25 13:56:35');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240618124746, '2025-08-25 13:56:38');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240801235015, '2025-08-25 13:56:41');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240805133720, '2025-08-25 13:56:45');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240827160934, '2025-08-25 13:56:48');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240919163303, '2025-08-25 13:56:52');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240919163305, '2025-08-25 13:56:56');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241019105805, '2025-08-25 13:56:59');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241030150047, '2025-08-25 13:57:11');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241108114728, '2025-08-25 13:57:16');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241121104152, '2025-08-25 13:57:19');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241130184212, '2025-08-25 13:57:23');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241220035512, '2025-08-25 13:57:27');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241220123912, '2025-08-25 13:57:30');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241224161212, '2025-08-25 13:57:33');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250107150512, '2025-08-25 13:57:37');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250110162412, '2025-08-25 13:57:40');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250123174212, '2025-08-25 13:57:43');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250128220012, '2025-08-25 13:57:47');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250506224012, '2025-08-25 13:57:49');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250523164012, '2025-08-25 13:57:53');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250714121412, '2025-08-25 13:57:56');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250905041441, '2025-09-23 22:04:46');


--
-- TOC entry 5534 (class 0 OID 17109)
-- Dependencies: 380
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- TOC entry 5516 (class 0 OID 16546)
-- Dependencies: 358
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) VALUES ('productos', 'productos', NULL, '2025-09-15 21:32:50.832835+00', '2025-09-15 21:32:50.832835+00', true, false, NULL, NULL, NULL, 'STANDARD');
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) VALUES ('productos-images', 'productos-images', NULL, '2025-09-19 17:28:10.823017+00', '2025-09-19 17:28:10.823017+00', true, false, 5242880, '{image/jpeg,image/jpg,image/png,image/webp}', NULL, 'STANDARD');
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) VALUES ('marcas-images', 'marcas-images', NULL, '2025-09-19 17:28:10.823017+00', '2025-09-19 17:28:10.823017+00', true, false, 2097152, '{image/jpeg,image/jpg,image/png,image/svg+xml}', NULL, 'STANDARD');
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) VALUES ('categorias-images', 'categorias-images', NULL, '2025-09-19 17:28:10.823017+00', '2025-09-19 17:28:10.823017+00', true, false, 2097152, '{image/jpeg,image/jpg,image/png,image/webp}', NULL, 'STANDARD');
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) VALUES ('usuarios-avatars', 'usuarios-avatars', NULL, '2025-09-19 17:28:10.823017+00', '2025-09-19 17:28:10.823017+00', true, false, 1048576, '{image/jpeg,image/jpg,image/png}', NULL, 'STANDARD');


--
-- TOC entry 5640 (class 0 OID 68466)
-- Dependencies: 494
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- TOC entry 5518 (class 0 OID 16588)
-- Dependencies: 360
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (0, 'create-migrations-table', 'e18db593bcde2aca2a408c4d1100f6abba2195df', '2025-08-25 13:53:33.437638');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (1, 'initialmigration', '6ab16121fbaa08bbd11b712d05f358f9b555d777', '2025-08-25 13:53:33.445858');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (2, 'storage-schema', '5c7968fd083fcea04050c1b7f6253c9771b99011', '2025-08-25 13:53:33.453104');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (3, 'pathtoken-column', '2cb1b0004b817b29d5b0a971af16bafeede4b70d', '2025-08-25 13:53:33.478266');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (4, 'add-migrations-rls', '427c5b63fe1c5937495d9c635c263ee7a5905058', '2025-08-25 13:53:33.534255');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (5, 'add-size-functions', '79e081a1455b63666c1294a440f8ad4b1e6a7f84', '2025-08-25 13:53:33.543105');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (6, 'change-column-name-in-get-size', 'f93f62afdf6613ee5e7e815b30d02dc990201044', '2025-08-25 13:53:33.550977');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (7, 'add-rls-to-buckets', 'e7e7f86adbc51049f341dfe8d30256c1abca17aa', '2025-08-25 13:53:33.557557');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (8, 'add-public-to-buckets', 'fd670db39ed65f9d08b01db09d6202503ca2bab3', '2025-08-25 13:53:33.563453');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (9, 'fix-search-function', '3a0af29f42e35a4d101c259ed955b67e1bee6825', '2025-08-25 13:53:33.569873');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (10, 'search-files-search-function', '68dc14822daad0ffac3746a502234f486182ef6e', '2025-08-25 13:53:33.577143');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (11, 'add-trigger-to-auto-update-updated_at-column', '7425bdb14366d1739fa8a18c83100636d74dcaa2', '2025-08-25 13:53:33.586595');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (12, 'add-automatic-avif-detection-flag', '8e92e1266eb29518b6a4c5313ab8f29dd0d08df9', '2025-08-25 13:53:33.599803');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (13, 'add-bucket-custom-limits', 'cce962054138135cd9a8c4bcd531598684b25e7d', '2025-08-25 13:53:33.611629');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (14, 'use-bytes-for-max-size', '941c41b346f9802b411f06f30e972ad4744dad27', '2025-08-25 13:53:33.621075');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (15, 'add-can-insert-object-function', '934146bc38ead475f4ef4b555c524ee5d66799e5', '2025-08-25 13:53:33.646873');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (16, 'add-version', '76debf38d3fd07dcfc747ca49096457d95b1221b', '2025-08-25 13:53:33.652784');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (17, 'drop-owner-foreign-key', 'f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101', '2025-08-25 13:53:33.65896');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (18, 'add_owner_id_column_deprecate_owner', 'e7a511b379110b08e2f214be852c35414749fe66', '2025-08-25 13:53:33.672555');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (19, 'alter-default-value-objects-id', '02e5e22a78626187e00d173dc45f58fa66a4f043', '2025-08-25 13:53:33.681488');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (20, 'list-objects-with-delimiter', 'cd694ae708e51ba82bf012bba00caf4f3b6393b7', '2025-08-25 13:53:33.688208');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (21, 's3-multipart-uploads', '8c804d4a566c40cd1e4cc5b3725a664a9303657f', '2025-08-25 13:53:33.697027');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (22, 's3-multipart-uploads-big-ints', '9737dc258d2397953c9953d9b86920b8be0cdb73', '2025-08-25 13:53:33.712989');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (23, 'optimize-search-function', '9d7e604cddc4b56a5422dc68c9313f4a1b6f132c', '2025-08-25 13:53:33.726062');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (24, 'operation-function', '8312e37c2bf9e76bbe841aa5fda889206d2bf8aa', '2025-08-25 13:53:33.732316');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (25, 'custom-metadata', 'd974c6057c3db1c1f847afa0e291e6165693b990', '2025-08-25 13:53:33.741561');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (26, 'objects-prefixes', 'ef3f7871121cdc47a65308e6702519e853422ae2', '2025-08-26 17:31:58.008612');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (27, 'search-v2', '33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2', '2025-08-26 17:31:58.897155');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (28, 'object-bucket-name-sorting', 'ba85ec41b62c6a30a3f136788227ee47f311c436', '2025-08-26 17:31:59.193037');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (29, 'create-prefixes', 'a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b', '2025-08-26 17:31:59.309772');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (30, 'update-object-levels', '6c6f6cc9430d570f26284a24cf7b210599032db7', '2025-08-26 17:31:59.402672');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (31, 'objects-level-index', '33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8', '2025-08-26 17:32:00.421598');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (32, 'backward-compatible-index-on-objects', '2d51eeb437a96868b36fcdfb1ddefdf13bef1647', '2025-08-26 17:32:00.504641');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (33, 'backward-compatible-index-on-prefixes', 'fe473390e1b8c407434c0e470655945b110507bf', '2025-08-26 17:32:00.597305');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (34, 'optimize-search-function-v1', '82b0e469a00e8ebce495e29bfa70a0797f7ebd2c', '2025-08-26 17:32:00.604712');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (35, 'add-insert-trigger-prefixes', '63bb9fd05deb3dc5e9fa66c83e82b152f0caf589', '2025-08-26 17:32:00.795615');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (36, 'optimise-existing-functions', '81cf92eb0c36612865a18016a38496c530443899', '2025-08-26 17:32:01.00204');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (37, 'add-bucket-name-length-trigger', '3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1', '2025-08-26 17:32:01.202567');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (38, 'iceberg-catalog-flag-on-buckets', '19a8bd89d5dfa69af7f222a46c726b7c41e462c5', '2025-08-26 17:32:01.327175');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (39, 'add-search-v2-sort-support', '39cf7d1e6bf515f4b02e41237aba845a7b492853', '2025-09-23 14:47:34.235549');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (40, 'fix-prefix-race-conditions-optimized', 'fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f', '2025-09-23 14:47:34.349345');


--
-- TOC entry 5517 (class 0 OID 16561)
-- Dependencies: 359
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) VALUES ('a2e3686f-6111-4a6c-a345-b779dff13238', 'productos-images', 'productos/.emptyFolderPlaceholder', NULL, '2025-09-19 20:29:16.920729+00', '2025-09-19 20:29:16.920729+00', '2025-09-19 20:29:16.920729+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-09-19T20:29:16.924Z", "contentLength": 0, "httpStatusCode": 200}', '8d73a235-f585-4247-8b22-33202fbb5771', NULL, '{}', 2);
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) VALUES ('20fa8f26-30be-4cc1-af2b-998e07d08024', 'productos-images', 'productos/INXHERR001/producto-INXHERR001-1758325920587-d6ffb769bmm.jpg', '82df97ec-0c85-495e-b673-31c03757603b', '2025-09-19 23:52:01.956563+00', '2025-09-19 23:52:01.956563+00', '2025-09-19 23:52:01.956563+00', '{"eTag": "\"c0c9c4c61d4b91a9c1e9afd8e3b040e2\"", "size": 27140, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-19T23:52:02.000Z", "contentLength": 27140, "httpStatusCode": 200}', '6d6139c8-2f05-4d4f-891d-a72f89675cee', '82df97ec-0c85-495e-b673-31c03757603b', '{}', 3);
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) VALUES ('4def740f-e927-426c-8cdd-efd5d5fed8de', 'productos-images', 'productos/INXHERR002/producto-INXHERR002-1758326640469-2xgaj39dej9.webp', '82df97ec-0c85-495e-b673-31c03757603b', '2025-09-20 00:04:02.16326+00', '2025-09-20 00:04:02.16326+00', '2025-09-20 00:04:02.16326+00', '{"eTag": "\"11ade4de43a59dce2e0a6894395a6124\"", "size": 13438, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-09-20T00:04:03.000Z", "contentLength": 13438, "httpStatusCode": 200}', '6299b6ab-a8a6-439c-9eab-205557ad38ea', '82df97ec-0c85-495e-b673-31c03757603b', '{}', 3);
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) VALUES ('c3643ad3-9715-4fef-81d2-6d2bcf7a79c4', 'productos-images', 'productos/INXHERR003/producto-INXHERR003-1758638852368-d7hrtrep5lp.jpg', '82df97ec-0c85-495e-b673-31c03757603b', '2025-09-23 14:47:33.306098+00', '2025-09-23 14:47:33.306098+00', '2025-09-23 14:47:33.306098+00', '{"eTag": "\"767a16a84c846e487a7452a33899db7c\"", "size": 133346, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T14:47:34.000Z", "contentLength": 133346, "httpStatusCode": 200}', '1f5bcd81-9944-43df-b9db-e0c70394a2fd', '82df97ec-0c85-495e-b673-31c03757603b', '{}', 3);


--
-- TOC entry 5639 (class 0 OID 68421)
-- Dependencies: 493
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.prefixes (bucket_id, name, created_at, updated_at) VALUES ('productos-images', 'productos', '2025-09-19 20:29:16.920729+00', '2025-09-19 20:29:16.920729+00');
INSERT INTO storage.prefixes (bucket_id, name, created_at, updated_at) VALUES ('productos-images', 'productos/INXHERR001', '2025-09-19 23:33:48.318305+00', '2025-09-19 23:33:48.318305+00');
INSERT INTO storage.prefixes (bucket_id, name, created_at, updated_at) VALUES ('productos-images', 'productos/INXHERR002', '2025-09-20 00:04:02.16326+00', '2025-09-20 00:04:02.16326+00');
INSERT INTO storage.prefixes (bucket_id, name, created_at, updated_at) VALUES ('productos-images', 'productos/INXHERR003', '2025-09-23 14:47:33.306098+00', '2025-09-23 14:47:33.306098+00');


--
-- TOC entry 5531 (class 0 OID 17040)
-- Dependencies: 376
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- TOC entry 5532 (class 0 OID 17054)
-- Dependencies: 377
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- TOC entry 4216 (class 0 OID 16658)
-- Dependencies: 361
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- TOC entry 6024 (class 0 OID 0)
-- Dependencies: 353
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 200, true);


--
-- TOC entry 6025 (class 0 OID 0)
-- Dependencies: 480
-- Name: carrito_compra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrito_compra_id_seq', 1, false);


--
-- TOC entry 6026 (class 0 OID 0)
-- Dependencies: 407
-- Name: categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_id_seq', 15, true);


--
-- TOC entry 6027 (class 0 OID 0)
-- Dependencies: 389
-- Name: ciudad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciudad_id_seq', 10, true);


--
-- TOC entry 6028 (class 0 OID 0)
-- Dependencies: 418
-- Name: cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cliente_id_seq', 4, true);


--
-- TOC entry 6029 (class 0 OID 0)
-- Dependencies: 447
-- Name: comunicacion_solicitud_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comunicacion_solicitud_id_seq', 1, false);


--
-- TOC entry 6030 (class 0 OID 0)
-- Dependencies: 403
-- Name: condiciones_comerciales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.condiciones_comerciales_id_seq', 10, true);


--
-- TOC entry 6031 (class 0 OID 0)
-- Dependencies: 428
-- Name: configuracion_fe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_fe_id_seq', 1, false);


--
-- TOC entry 6032 (class 0 OID 0)
-- Dependencies: 484
-- Name: costos_operativos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.costos_operativos_id_seq', 1, false);


--
-- TOC entry 6033 (class 0 OID 0)
-- Dependencies: 462
-- Name: cotizacion_detalle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cotizacion_detalle_id_seq', 9, true);


--
-- TOC entry 6034 (class 0 OID 0)
-- Dependencies: 460
-- Name: cotizacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cotizacion_id_seq', 14, true);


--
-- TOC entry 6035 (class 0 OID 0)
-- Dependencies: 456
-- Name: crm_actividad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crm_actividad_id_seq', 1, false);


--
-- TOC entry 6036 (class 0 OID 0)
-- Dependencies: 413
-- Name: crm_etapa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crm_etapa_id_seq', 13, true);


--
-- TOC entry 6037 (class 0 OID 0)
-- Dependencies: 458
-- Name: crm_nota_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crm_nota_id_seq', 1, false);


--
-- TOC entry 6038 (class 0 OID 0)
-- Dependencies: 478
-- Name: crowdlending_operacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crowdlending_operacion_id_seq', 1, false);


--
-- TOC entry 6039 (class 0 OID 0)
-- Dependencies: 472
-- Name: cuenta_por_cobrar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cuenta_por_cobrar_id_seq', 1, false);


--
-- TOC entry 6040 (class 0 OID 0)
-- Dependencies: 452
-- Name: detalle_solicitud_cotizacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_solicitud_cotizacion_id_seq', 1, false);


--
-- TOC entry 6041 (class 0 OID 0)
-- Dependencies: 443
-- Name: direccion_cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.direccion_cliente_id_seq', 1, false);


--
-- TOC entry 6042 (class 0 OID 0)
-- Dependencies: 397
-- Name: disponibilidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disponibilidad_id_seq', 10, true);


--
-- TOC entry 6043 (class 0 OID 0)
-- Dependencies: 391
-- Name: distrito_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.distrito_id_seq', 1, false);


--
-- TOC entry 6044 (class 0 OID 0)
-- Dependencies: 420
-- Name: empresa_emisora_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresa_emisora_id_seq', 10, true);


--
-- TOC entry 6045 (class 0 OID 0)
-- Dependencies: 497
-- Name: estado_cotizacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_cotizacion_id_seq', 16, true);


--
-- TOC entry 6046 (class 0 OID 0)
-- Dependencies: 476
-- Name: factoring_operacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.factoring_operacion_id_seq', 1, false);


--
-- TOC entry 6047 (class 0 OID 0)
-- Dependencies: 470
-- Name: factura_detalle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.factura_detalle_id_seq', 1, false);


--
-- TOC entry 6048 (class 0 OID 0)
-- Dependencies: 468
-- Name: factura_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.factura_id_seq', 1, false);


--
-- TOC entry 6049 (class 0 OID 0)
-- Dependencies: 401
-- Name: forma_pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.forma_pago_id_seq', 10, true);


--
-- TOC entry 6050 (class 0 OID 0)
-- Dependencies: 482
-- Name: historial_precios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_precios_id_seq', 31, true);


--
-- TOC entry 6051 (class 0 OID 0)
-- Dependencies: 486
-- Name: inversion_categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inversion_categoria_id_seq', 1, false);


--
-- TOC entry 6052 (class 0 OID 0)
-- Dependencies: 409
-- Name: marca_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.marca_id_seq', 58, true);


--
-- TOC entry 6053 (class 0 OID 0)
-- Dependencies: 385
-- Name: moneda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.moneda_id_seq', 10, true);


--
-- TOC entry 6054 (class 0 OID 0)
-- Dependencies: 454
-- Name: oportunidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oportunidad_id_seq', 1, false);


--
-- TOC entry 6055 (class 0 OID 0)
-- Dependencies: 474
-- Name: pago_recibido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pago_recibido_id_seq', 1, false);


--
-- TOC entry 6056 (class 0 OID 0)
-- Dependencies: 387
-- Name: pais_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pais_id_seq', 10, true);


--
-- TOC entry 6057 (class 0 OID 0)
-- Dependencies: 466
-- Name: pedido_detalle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedido_detalle_id_seq', 1, false);


--
-- TOC entry 6058 (class 0 OID 0)
-- Dependencies: 464
-- Name: pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedido_id_seq', 1, false);


--
-- TOC entry 6059 (class 0 OID 0)
-- Dependencies: 450
-- Name: procesamiento_archivo_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procesamiento_archivo_log_id_seq', 1, false);


--
-- TOC entry 6060 (class 0 OID 0)
-- Dependencies: 514
-- Name: producto_precio_moneda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_precio_moneda_id_seq', 12, true);


--
-- TOC entry 6061 (class 0 OID 0)
-- Dependencies: 435
-- Name: producto_proveedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_proveedor_id_seq', 22, true);


--
-- TOC entry 6062 (class 0 OID 0)
-- Dependencies: 433
-- Name: producto_sku_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_sku_seq', 29, true);


--
-- TOC entry 6063 (class 0 OID 0)
-- Dependencies: 439
-- Name: promocion_descuento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promocion_descuento_id_seq', 1, false);


--
-- TOC entry 6064 (class 0 OID 0)
-- Dependencies: 437
-- Name: promocion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promocion_id_seq', 1, false);


--
-- TOC entry 6065 (class 0 OID 0)
-- Dependencies: 441
-- Name: promocion_uso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promocion_uso_id_seq', 1, false);


--
-- TOC entry 6066 (class 0 OID 0)
-- Dependencies: 422
-- Name: proveedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proveedor_id_seq', 25, true);


--
-- TOC entry 6067 (class 0 OID 0)
-- Dependencies: 424
-- Name: recogedores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recogedores_id_seq', 1, false);


--
-- TOC entry 6068 (class 0 OID 0)
-- Dependencies: 393
-- Name: rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_seq', 10, true);


--
-- TOC entry 6069 (class 0 OID 0)
-- Dependencies: 405
-- Name: rubro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rubro_id_seq', 20, true);


--
-- TOC entry 6070 (class 0 OID 0)
-- Dependencies: 445
-- Name: solicitud_cotizacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitud_cotizacion_id_seq', 1, false);


--
-- TOC entry 6071 (class 0 OID 0)
-- Dependencies: 384
-- Name: tipo_cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_cliente_id_seq', 10, true);


--
-- TOC entry 6072 (class 0 OID 0)
-- Dependencies: 395
-- Name: tipo_cliente_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_cliente_id_seq1', 2, true);


--
-- TOC entry 6073 (class 0 OID 0)
-- Dependencies: 499
-- Name: tipo_contacto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_contacto_id_seq', 3, true);


--
-- TOC entry 6074 (class 0 OID 0)
-- Dependencies: 501
-- Name: transicion_estado_cotizacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transicion_estado_cotizacion_id_seq', 20, true);


--
-- TOC entry 6075 (class 0 OID 0)
-- Dependencies: 399
-- Name: unidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unidad_id_seq', 20, true);


--
-- TOC entry 6076 (class 0 OID 0)
-- Dependencies: 416
-- Name: usuario_rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_rol_id_seq', 6, true);


--
-- TOC entry 6077 (class 0 OID 0)
-- Dependencies: 411
-- Name: vehicle_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicle_types_id_seq', 1, false);


--
-- TOC entry 6078 (class 0 OID 0)
-- Dependencies: 379
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 4777 (class 2606 OID 16827)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 4732 (class 2606 OID 16531)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 4800 (class 2606 OID 16933)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 4756 (class 2606 OID 16951)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 4758 (class 2606 OID 16961)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 4730 (class 2606 OID 16524)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 16820)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 4775 (class 2606 OID 16808)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 4767 (class 2606 OID 17001)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 4769 (class 2606 OID 16795)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 5025 (class 2606 OID 77048)
-- Name: oauth_clients oauth_clients_client_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_client_id_key UNIQUE (client_id);


--
-- TOC entry 5028 (class 2606 OID 77046)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4804 (class 2606 OID 16986)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4724 (class 2606 OID 16514)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4727 (class 2606 OID 16738)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 4789 (class 2606 OID 16867)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 4791 (class 2606 OID 16865)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 16881)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4735 (class 2606 OID 16537)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4762 (class 2606 OID 16759)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 16848)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 16839)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4717 (class 2606 OID 16921)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 4719 (class 2606 OID 16501)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5009 (class 2606 OID 67974)
-- Name: carrito_compra carrito_compra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_compra
    ADD CONSTRAINT carrito_compra_pkey PRIMARY KEY (id);


--
-- TOC entry 4865 (class 2606 OID 66784)
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);


--
-- TOC entry 4835 (class 2606 OID 66660)
-- Name: ciudad ciudad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_pkey PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 66874)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id);


--
-- TOC entry 4948 (class 2606 OID 67334)
-- Name: comunicacion_solicitud comunicacion_solicitud_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comunicacion_solicitud
    ADD CONSTRAINT comunicacion_solicitud_pkey PRIMARY KEY (id);


--
-- TOC entry 4857 (class 2606 OID 66757)
-- Name: condiciones_comerciales condiciones_comerciales_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condiciones_comerciales
    ADD CONSTRAINT condiciones_comerciales_codigo_key UNIQUE (codigo);


--
-- TOC entry 4859 (class 2606 OID 66755)
-- Name: condiciones_comerciales condiciones_comerciales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condiciones_comerciales
    ADD CONSTRAINT condiciones_comerciales_pkey PRIMARY KEY (id);


--
-- TOC entry 4906 (class 2606 OID 66992)
-- Name: configuracion_archivos configuracion_archivos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_archivos
    ADD CONSTRAINT configuracion_archivos_pkey PRIMARY KEY (clave);


--
-- TOC entry 4908 (class 2606 OID 67007)
-- Name: configuracion_fe configuracion_fe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_fe
    ADD CONSTRAINT configuracion_fe_pkey PRIMARY KEY (id);


--
-- TOC entry 4904 (class 2606 OID 66981)
-- Name: configuracion_sistema configuracion_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT configuracion_sistema_pkey PRIMARY KEY (clave);


--
-- TOC entry 5015 (class 2606 OID 68046)
-- Name: costos_operativos costos_operativos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costos_operativos
    ADD CONSTRAINT costos_operativos_pkey PRIMARY KEY (id);


--
-- TOC entry 4974 (class 2606 OID 67613)
-- Name: cotizacion_detalle cotizacion_detalle_id_cotizacion_item_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_detalle
    ADD CONSTRAINT cotizacion_detalle_id_cotizacion_item_key UNIQUE (id_cotizacion, item);


--
-- TOC entry 4976 (class 2606 OID 67611)
-- Name: cotizacion_detalle cotizacion_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_detalle
    ADD CONSTRAINT cotizacion_detalle_pkey PRIMARY KEY (id);


--
-- TOC entry 4968 (class 2606 OID 67559)
-- Name: cotizacion cotizacion_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_numero_key UNIQUE (numero);


--
-- TOC entry 4970 (class 2606 OID 67557)
-- Name: cotizacion cotizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4962 (class 2606 OID 67458)
-- Name: crm_actividad crm_actividad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_actividad
    ADD CONSTRAINT crm_actividad_pkey PRIMARY KEY (id);


--
-- TOC entry 4875 (class 2606 OID 66825)
-- Name: crm_etapa crm_etapa_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_etapa
    ADD CONSTRAINT crm_etapa_nombre_key UNIQUE (nombre);


--
-- TOC entry 4877 (class 2606 OID 66823)
-- Name: crm_etapa crm_etapa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_etapa
    ADD CONSTRAINT crm_etapa_pkey PRIMARY KEY (id);


--
-- TOC entry 4966 (class 2606 OID 67500)
-- Name: crm_nota crm_nota_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_nota
    ADD CONSTRAINT crm_nota_pkey PRIMARY KEY (id);


--
-- TOC entry 5007 (class 2606 OID 67950)
-- Name: crowdlending_operacion crowdlending_operacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crowdlending_operacion
    ADD CONSTRAINT crowdlending_operacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 67845)
-- Name: cuenta_por_cobrar cuenta_por_cobrar_numero_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_por_cobrar
    ADD CONSTRAINT cuenta_por_cobrar_numero_documento_key UNIQUE (numero_documento);


--
-- TOC entry 4999 (class 2606 OID 67843)
-- Name: cuenta_por_cobrar cuenta_por_cobrar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_por_cobrar
    ADD CONSTRAINT cuenta_por_cobrar_pkey PRIMARY KEY (id);


--
-- TOC entry 4954 (class 2606 OID 67382)
-- Name: detalle_solicitud_cotizacion detalle_solicitud_cotizacion_id_solicitud_cotizacion_item_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_solicitud_cotizacion
    ADD CONSTRAINT detalle_solicitud_cotizacion_id_solicitud_cotizacion_item_key UNIQUE (id_solicitud_cotizacion, item);


--
-- TOC entry 4956 (class 2606 OID 67380)
-- Name: detalle_solicitud_cotizacion detalle_solicitud_cotizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_solicitud_cotizacion
    ADD CONSTRAINT detalle_solicitud_cotizacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4939 (class 2606 OID 67256)
-- Name: direccion_cliente direccion_cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion_cliente
    ADD CONSTRAINT direccion_cliente_pkey PRIMARY KEY (id);


--
-- TOC entry 4845 (class 2606 OID 66714)
-- Name: disponibilidad disponibilidad_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidad
    ADD CONSTRAINT disponibilidad_codigo_key UNIQUE (codigo);


--
-- TOC entry 4847 (class 2606 OID 66712)
-- Name: disponibilidad disponibilidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidad
    ADD CONSTRAINT disponibilidad_pkey PRIMARY KEY (id);


--
-- TOC entry 4837 (class 2606 OID 66675)
-- Name: distrito distrito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distrito
    ADD CONSTRAINT distrito_pkey PRIMARY KEY (id);


--
-- TOC entry 4890 (class 2606 OID 66900)
-- Name: empresa_emisora empresa_emisora_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_emisora
    ADD CONSTRAINT empresa_emisora_pkey PRIMARY KEY (id);


--
-- TOC entry 4892 (class 2606 OID 66902)
-- Name: empresa_emisora empresa_emisora_ruc_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_emisora
    ADD CONSTRAINT empresa_emisora_ruc_key UNIQUE (ruc);


--
-- TOC entry 5030 (class 2606 OID 86656)
-- Name: estado_cotizacion estado_cotizacion_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_cotizacion
    ADD CONSTRAINT estado_cotizacion_codigo_key UNIQUE (codigo);


--
-- TOC entry 5032 (class 2606 OID 86654)
-- Name: estado_cotizacion estado_cotizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_cotizacion
    ADD CONSTRAINT estado_cotizacion_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 67929)
-- Name: factoring_operacion factoring_operacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factoring_operacion
    ADD CONSTRAINT factoring_operacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 67816)
-- Name: factura_detalle factura_detalle_id_factura_item_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_detalle
    ADD CONSTRAINT factura_detalle_id_factura_item_key UNIQUE (id_factura, item);


--
-- TOC entry 4995 (class 2606 OID 67814)
-- Name: factura_detalle factura_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_detalle
    ADD CONSTRAINT factura_detalle_pkey PRIMARY KEY (id);


--
-- TOC entry 4986 (class 2606 OID 67765)
-- Name: factura factura_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_numero_key UNIQUE (numero);


--
-- TOC entry 4988 (class 2606 OID 67763)
-- Name: factura factura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_pkey PRIMARY KEY (id);


--
-- TOC entry 4853 (class 2606 OID 66741)
-- Name: forma_pago forma_pago_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_pago
    ADD CONSTRAINT forma_pago_codigo_key UNIQUE (codigo);


--
-- TOC entry 4855 (class 2606 OID 66739)
-- Name: forma_pago forma_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_pago
    ADD CONSTRAINT forma_pago_pkey PRIMARY KEY (id);


--
-- TOC entry 5011 (class 2606 OID 68004)
-- Name: historial_precios historial_precios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_precios
    ADD CONSTRAINT historial_precios_pkey PRIMARY KEY (id);


--
-- TOC entry 5017 (class 2606 OID 68065)
-- Name: inversion_categoria inversion_categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inversion_categoria
    ADD CONSTRAINT inversion_categoria_pkey PRIMARY KEY (id);


--
-- TOC entry 4910 (class 2606 OID 67025)
-- Name: marca_categoria marca_categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marca_categoria
    ADD CONSTRAINT marca_categoria_pkey PRIMARY KEY (id_marca, id_categoria);


--
-- TOC entry 4867 (class 2606 OID 66797)
-- Name: marca marca_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marca
    ADD CONSTRAINT marca_codigo_key UNIQUE (codigo);


--
-- TOC entry 4869 (class 2606 OID 66795)
-- Name: marca marca_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marca
    ADD CONSTRAINT marca_pkey PRIMARY KEY (id);


--
-- TOC entry 4823 (class 2606 OID 66629)
-- Name: moneda moneda_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moneda
    ADD CONSTRAINT moneda_codigo_key UNIQUE (codigo);


--
-- TOC entry 4825 (class 2606 OID 66627)
-- Name: moneda moneda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moneda
    ADD CONSTRAINT moneda_pkey PRIMARY KEY (id);


--
-- TOC entry 4960 (class 2606 OID 67413)
-- Name: oportunidad oportunidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oportunidad
    ADD CONSTRAINT oportunidad_pkey PRIMARY KEY (id);


--
-- TOC entry 5001 (class 2606 OID 67886)
-- Name: pago_recibido pago_recibido_numero_recibo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_recibido
    ADD CONSTRAINT pago_recibido_numero_recibo_key UNIQUE (numero_recibo);


--
-- TOC entry 5003 (class 2606 OID 67884)
-- Name: pago_recibido pago_recibido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_recibido
    ADD CONSTRAINT pago_recibido_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 66646)
-- Name: pais pais_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_codigo_key UNIQUE (codigo);


--
-- TOC entry 4829 (class 2606 OID 66644)
-- Name: pais pais_iso_code_2_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_iso_code_2_key UNIQUE (iso_code_2);


--
-- TOC entry 4831 (class 2606 OID 66642)
-- Name: pais pais_iso_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_iso_code_key UNIQUE (iso_code);


--
-- TOC entry 4833 (class 2606 OID 66640)
-- Name: pais pais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_pkey PRIMARY KEY (id);


--
-- TOC entry 4982 (class 2606 OID 67726)
-- Name: pedido_detalle pedido_detalle_id_pedido_item_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_detalle
    ADD CONSTRAINT pedido_detalle_id_pedido_item_key UNIQUE (id_pedido, item);


--
-- TOC entry 4984 (class 2606 OID 67724)
-- Name: pedido_detalle pedido_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_detalle
    ADD CONSTRAINT pedido_detalle_pkey PRIMARY KEY (id);


--
-- TOC entry 4978 (class 2606 OID 67663)
-- Name: pedido pedido_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_numero_key UNIQUE (numero);


--
-- TOC entry 4980 (class 2606 OID 67661)
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id);


--
-- TOC entry 4952 (class 2606 OID 67367)
-- Name: procesamiento_archivo_log procesamiento_archivo_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procesamiento_archivo_log
    ADD CONSTRAINT procesamiento_archivo_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4920 (class 2606 OID 67101)
-- Name: producto producto_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_codigo_key UNIQUE (sku_producto);


--
-- TOC entry 4922 (class 2606 OID 67099)
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (sku);


--
-- TOC entry 5073 (class 2606 OID 106233)
-- Name: producto_precio_moneda producto_precio_moneda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_precio_moneda
    ADD CONSTRAINT producto_precio_moneda_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 67169)
-- Name: producto_proveedor producto_proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_proveedor
    ADD CONSTRAINT producto_proveedor_pkey PRIMARY KEY (id);


--
-- TOC entry 4931 (class 2606 OID 67171)
-- Name: producto_proveedor producto_proveedor_sku_id_proveedor_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_proveedor
    ADD CONSTRAINT producto_proveedor_sku_id_proveedor_key UNIQUE (sku, id_proveedor);


--
-- TOC entry 4924 (class 2606 OID 67103)
-- Name: producto producto_seo_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_seo_slug_key UNIQUE (seo_slug);


--
-- TOC entry 4935 (class 2606 OID 67217)
-- Name: promocion_descuento promocion_descuento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion_descuento
    ADD CONSTRAINT promocion_descuento_pkey PRIMARY KEY (id);


--
-- TOC entry 4933 (class 2606 OID 67201)
-- Name: promocion promocion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion
    ADD CONSTRAINT promocion_pkey PRIMARY KEY (id);


--
-- TOC entry 4937 (class 2606 OID 67231)
-- Name: promocion_uso promocion_uso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion_uso
    ADD CONSTRAINT promocion_uso_pkey PRIMARY KEY (id);


--
-- TOC entry 4914 (class 2606 OID 67062)
-- Name: proveedor_categoria proveedor_categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor_categoria
    ADD CONSTRAINT proveedor_categoria_pkey PRIMARY KEY (id_proveedor, id_categoria);


--
-- TOC entry 4894 (class 2606 OID 66928)
-- Name: proveedor proveedor_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_codigo_key UNIQUE (codigo);


--
-- TOC entry 4896 (class 2606 OID 66930)
-- Name: proveedor proveedor_documento_empresa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_documento_empresa_key UNIQUE (documento_empresa);


--
-- TOC entry 4912 (class 2606 OID 67044)
-- Name: proveedor_marca proveedor_marca_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor_marca
    ADD CONSTRAINT proveedor_marca_pkey PRIMARY KEY (id_proveedor, id_marca);


--
-- TOC entry 4898 (class 2606 OID 66926)
-- Name: proveedor proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 66962)
-- Name: recogedores recogedores_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recogedores
    ADD CONSTRAINT recogedores_correo_key UNIQUE (correo);


--
-- TOC entry 4902 (class 2606 OID 66960)
-- Name: recogedores recogedores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recogedores
    ADD CONSTRAINT recogedores_pkey PRIMARY KEY (id);


--
-- TOC entry 4839 (class 2606 OID 66691)
-- Name: rol rol_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_nombre_key UNIQUE (nombre);


--
-- TOC entry 4841 (class 2606 OID 66689)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id);


--
-- TOC entry 4861 (class 2606 OID 66775)
-- Name: rubro rubro_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rubro
    ADD CONSTRAINT rubro_codigo_key UNIQUE (codigo);


--
-- TOC entry 4863 (class 2606 OID 66773)
-- Name: rubro rubro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rubro
    ADD CONSTRAINT rubro_pkey PRIMARY KEY (id);


--
-- TOC entry 4950 (class 2606 OID 67352)
-- Name: solicitud_archivo solicitud_archivo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_archivo
    ADD CONSTRAINT solicitud_archivo_pkey PRIMARY KEY (id_solicitud_cotizacion, id_archivo);


--
-- TOC entry 4944 (class 2606 OID 67306)
-- Name: solicitud_cotizacion solicitud_cotizacion_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cotizacion
    ADD CONSTRAINT solicitud_cotizacion_codigo_key UNIQUE (codigo);


--
-- TOC entry 4946 (class 2606 OID 67304)
-- Name: solicitud_cotizacion solicitud_cotizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cotizacion
    ADD CONSTRAINT solicitud_cotizacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4843 (class 2606 OID 66699)
-- Name: tipo_cliente tipo_cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cliente
    ADD CONSTRAINT tipo_cliente_pkey PRIMARY KEY (id);


--
-- TOC entry 5037 (class 2606 OID 89072)
-- Name: tipo_contacto tipo_contacto_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_contacto
    ADD CONSTRAINT tipo_contacto_codigo_key UNIQUE (codigo);


--
-- TOC entry 5039 (class 2606 OID 89070)
-- Name: tipo_contacto tipo_contacto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_contacto
    ADD CONSTRAINT tipo_contacto_pkey PRIMARY KEY (id);


--
-- TOC entry 5047 (class 2606 OID 90356)
-- Name: transicion_estado_cotizacion transicion_estado_cotizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transicion_estado_cotizacion
    ADD CONSTRAINT transicion_estado_cotizacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4849 (class 2606 OID 66727)
-- Name: unidad unidad_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidad
    ADD CONSTRAINT unidad_codigo_key UNIQUE (codigo);


--
-- TOC entry 4851 (class 2606 OID 66725)
-- Name: unidad unidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidad
    ADD CONSTRAINT unidad_pkey PRIMARY KEY (id);


--
-- TOC entry 4879 (class 2606 OID 66836)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 4881 (class 2606 OID 66847)
-- Name: usuario_rol usuario_rol_id_usuario_id_rol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_id_usuario_id_rol_key UNIQUE (id_usuario, id_rol);


--
-- TOC entry 4883 (class 2606 OID 66845)
-- Name: usuario_rol usuario_rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_pkey PRIMARY KEY (id);


--
-- TOC entry 4871 (class 2606 OID 66810)
-- Name: vehicle_types vehicle_types_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_types
    ADD CONSTRAINT vehicle_types_nombre_key UNIQUE (nombre);


--
-- TOC entry 4873 (class 2606 OID 66808)
-- Name: vehicle_types vehicle_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_types
    ADD CONSTRAINT vehicle_types_pkey PRIMARY KEY (id);


--
-- TOC entry 4821 (class 2606 OID 17269)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 5050 (class 2606 OID 97140)
-- Name: messages_2025_09_22 messages_2025_09_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_09_22
    ADD CONSTRAINT messages_2025_09_22_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 5053 (class 2606 OID 102126)
-- Name: messages_2025_09_23 messages_2025_09_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_09_23
    ADD CONSTRAINT messages_2025_09_23_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 5056 (class 2606 OID 102137)
-- Name: messages_2025_09_24 messages_2025_09_24_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_09_24
    ADD CONSTRAINT messages_2025_09_24_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 5059 (class 2606 OID 102148)
-- Name: messages_2025_09_25 messages_2025_09_25_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_09_25
    ADD CONSTRAINT messages_2025_09_25_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 5062 (class 2606 OID 102260)
-- Name: messages_2025_09_26 messages_2025_09_26_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_09_26
    ADD CONSTRAINT messages_2025_09_26_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 5065 (class 2606 OID 102375)
-- Name: messages_2025_09_27 messages_2025_09_27_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_09_27
    ADD CONSTRAINT messages_2025_09_27_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 5068 (class 2606 OID 105120)
-- Name: messages_2025_09_28 messages_2025_09_28_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2025_09_28
    ADD CONSTRAINT messages_2025_09_28_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4817 (class 2606 OID 17117)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 4809 (class 2606 OID 17007)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 5022 (class 2606 OID 68476)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 4738 (class 2606 OID 16554)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 4748 (class 2606 OID 16595)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 4750 (class 2606 OID 16593)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4746 (class 2606 OID 16571)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 5020 (class 2606 OID 68430)
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- TOC entry 4814 (class 2606 OID 17063)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4812 (class 2606 OID 17048)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4733 (class 1259 OID 16532)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 4707 (class 1259 OID 16748)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4708 (class 1259 OID 16750)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4709 (class 1259 OID 16751)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4765 (class 1259 OID 16829)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 4798 (class 1259 OID 16937)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 4754 (class 1259 OID 16917)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 6079 (class 0 OID 0)
-- Dependencies: 4754
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 4759 (class 1259 OID 16745)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 4801 (class 1259 OID 16934)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 4802 (class 1259 OID 16935)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 4773 (class 1259 OID 16940)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 4770 (class 1259 OID 16801)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 4771 (class 1259 OID 16946)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 5023 (class 1259 OID 77049)
-- Name: oauth_clients_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_client_id_idx ON auth.oauth_clients USING btree (client_id);


--
-- TOC entry 5026 (class 1259 OID 77050)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- TOC entry 4805 (class 1259 OID 16993)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 4806 (class 1259 OID 16992)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 4807 (class 1259 OID 16994)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 4710 (class 1259 OID 16752)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4711 (class 1259 OID 16749)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4720 (class 1259 OID 16515)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 4721 (class 1259 OID 16516)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 4722 (class 1259 OID 16744)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 4725 (class 1259 OID 16831)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 4728 (class 1259 OID 16936)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 4792 (class 1259 OID 16873)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 4793 (class 1259 OID 16938)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 4794 (class 1259 OID 16888)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 4797 (class 1259 OID 16887)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 4760 (class 1259 OID 16939)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 4763 (class 1259 OID 16830)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 4784 (class 1259 OID 16855)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 4787 (class 1259 OID 16854)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 4782 (class 1259 OID 16840)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 4783 (class 1259 OID 17002)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- TOC entry 4772 (class 1259 OID 16999)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 4764 (class 1259 OID 16828)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 4712 (class 1259 OID 16908)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 6080 (class 0 OID 0)
-- Dependencies: 4712
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 4713 (class 1259 OID 16746)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 4714 (class 1259 OID 16505)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 4715 (class 1259 OID 16963)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 4886 (class 1259 OID 68160)
-- Name: idx_cliente_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_email ON public.cliente USING btree (correo);


--
-- TOC entry 4887 (class 1259 OID 68162)
-- Name: idx_cliente_ruc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_ruc ON public.cliente USING btree (documento_empresa);


--
-- TOC entry 4888 (class 1259 OID 68161)
-- Name: idx_cliente_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cliente_tipo ON public.cliente USING btree (id_tipo_cliente) WHERE (activo = true);


--
-- TOC entry 4971 (class 1259 OID 68157)
-- Name: idx_cotizacion_cliente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_cliente ON public.cotizacion USING btree (id_cliente) WHERE (activo = true);


--
-- TOC entry 4972 (class 1259 OID 68158)
-- Name: idx_cotizacion_fecha_emision; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_fecha_emision ON public.cotizacion USING btree (fecha_emision) WHERE (activo = true);


--
-- TOC entry 4963 (class 1259 OID 68172)
-- Name: idx_crm_actividad_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crm_actividad_fecha ON public.crm_actividad USING btree (fecha_programada);


--
-- TOC entry 4964 (class 1259 OID 68171)
-- Name: idx_crm_actividad_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crm_actividad_usuario ON public.crm_actividad USING btree (id_usuario);


--
-- TOC entry 5033 (class 1259 OID 86663)
-- Name: idx_estado_cotizacion_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_estado_cotizacion_activo ON public.estado_cotizacion USING btree (activo);


--
-- TOC entry 5034 (class 1259 OID 89016)
-- Name: idx_estado_cotizacion_exitoso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_estado_cotizacion_exitoso ON public.estado_cotizacion USING btree (es_exitoso) WHERE (activo = true);


--
-- TOC entry 5035 (class 1259 OID 89038)
-- Name: idx_estado_cotizacion_final; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_estado_cotizacion_final ON public.estado_cotizacion USING btree (es_estado_final) WHERE (activo = true);


--
-- TOC entry 4989 (class 1259 OID 68173)
-- Name: idx_factura_cliente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_cliente ON public.factura USING btree (id_cliente) WHERE (activo = true);


--
-- TOC entry 4990 (class 1259 OID 68175)
-- Name: idx_factura_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_estado ON public.factura USING btree (estado_documento);


--
-- TOC entry 4991 (class 1259 OID 68174)
-- Name: idx_factura_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_fecha ON public.factura USING btree (fecha_emision);


--
-- TOC entry 5012 (class 1259 OID 68177)
-- Name: idx_historial_precios_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_precios_fecha ON public.historial_precios USING btree (fecha_cambio);


--
-- TOC entry 5013 (class 1259 OID 68176)
-- Name: idx_historial_precios_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_precios_sku ON public.historial_precios USING btree (sku);


--
-- TOC entry 4957 (class 1259 OID 68170)
-- Name: idx_oportunidad_asesor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oportunidad_asesor ON public.oportunidad USING btree (id_asesor) WHERE ((estado)::text = 'ACTIVA'::text);


--
-- TOC entry 4958 (class 1259 OID 68169)
-- Name: idx_oportunidad_etapa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_oportunidad_etapa ON public.oportunidad USING btree (id_etapa) WHERE ((estado)::text = 'ACTIVA'::text);


--
-- TOC entry 4915 (class 1259 OID 68153)
-- Name: idx_producto_categoria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_categoria ON public.producto USING btree (id_categoria) WHERE (activo = true);


--
-- TOC entry 4916 (class 1259 OID 68154)
-- Name: idx_producto_marca; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_marca ON public.producto USING btree (id_marca) WHERE (activo = true);


--
-- TOC entry 4917 (class 1259 OID 68156)
-- Name: idx_producto_nombre_trgm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_nombre_trgm ON public.producto USING gin (nombre public.gin_trgm_ops);


--
-- TOC entry 5069 (class 1259 OID 106313)
-- Name: idx_producto_precio_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_precio_activo ON public.producto_precio_moneda USING btree (activo);


--
-- TOC entry 5070 (class 1259 OID 106312)
-- Name: idx_producto_precio_moneda_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_precio_moneda_id ON public.producto_precio_moneda USING btree (id_moneda);


--
-- TOC entry 5071 (class 1259 OID 106311)
-- Name: idx_producto_precio_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_precio_sku ON public.producto_precio_moneda USING btree (sku);


--
-- TOC entry 4925 (class 1259 OID 68165)
-- Name: idx_producto_proveedor_principal; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_proveedor_principal ON public.producto_proveedor USING btree (es_proveedor_principal) WHERE (activo = true);


--
-- TOC entry 4926 (class 1259 OID 68164)
-- Name: idx_producto_proveedor_proveedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_proveedor_proveedor ON public.producto_proveedor USING btree (id_proveedor) WHERE (activo = true);


--
-- TOC entry 4927 (class 1259 OID 68163)
-- Name: idx_producto_proveedor_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_proveedor_sku ON public.producto_proveedor USING btree (sku) WHERE (activo = true);


--
-- TOC entry 4918 (class 1259 OID 68155)
-- Name: idx_producto_visible_web; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_visible_web ON public.producto USING btree (visible_web, activo);


--
-- TOC entry 4940 (class 1259 OID 68167)
-- Name: idx_solicitud_asesor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_solicitud_asesor ON public.solicitud_cotizacion USING btree (id_asesor_asignado);


--
-- TOC entry 4941 (class 1259 OID 68166)
-- Name: idx_solicitud_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_solicitud_estado ON public.solicitud_cotizacion USING btree (estado);


--
-- TOC entry 4942 (class 1259 OID 68168)
-- Name: idx_solicitud_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_solicitud_fecha ON public.solicitud_cotizacion USING btree (fecha_solicitud);


--
-- TOC entry 5040 (class 1259 OID 90382)
-- Name: idx_transicion_analisis; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transicion_analisis ON public.transicion_estado_cotizacion USING btree (fecha_transicion, estado_nuevo_id, valor_estimado) WHERE (automatico = true);


--
-- TOC entry 5041 (class 1259 OID 90381)
-- Name: idx_transicion_automatico; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transicion_automatico ON public.transicion_estado_cotizacion USING btree (automatico);


--
-- TOC entry 5042 (class 1259 OID 90377)
-- Name: idx_transicion_cotizacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transicion_cotizacion ON public.transicion_estado_cotizacion USING btree (id_cotizacion);


--
-- TOC entry 5043 (class 1259 OID 90380)
-- Name: idx_transicion_estados; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transicion_estados ON public.transicion_estado_cotizacion USING btree (estado_anterior_id, estado_nuevo_id);


--
-- TOC entry 5044 (class 1259 OID 90378)
-- Name: idx_transicion_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transicion_fecha ON public.transicion_estado_cotizacion USING btree (fecha_transicion);


--
-- TOC entry 5045 (class 1259 OID 90379)
-- Name: idx_transicion_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transicion_usuario ON public.transicion_estado_cotizacion USING btree (usuario_responsable);


--
-- TOC entry 5074 (class 1259 OID 106310)
-- Name: unique_sku_moneda_activo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_sku_moneda_activo_idx ON public.producto_precio_moneda USING btree (sku, id_moneda) WHERE (activo = true);


--
-- TOC entry 4815 (class 1259 OID 17270)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 4819 (class 1259 OID 102358)
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 5048 (class 1259 OID 102362)
-- Name: messages_2025_09_22_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_09_22_inserted_at_topic_idx ON realtime.messages_2025_09_22 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 5051 (class 1259 OID 102363)
-- Name: messages_2025_09_23_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_09_23_inserted_at_topic_idx ON realtime.messages_2025_09_23 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 5054 (class 1259 OID 102364)
-- Name: messages_2025_09_24_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_09_24_inserted_at_topic_idx ON realtime.messages_2025_09_24 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 5057 (class 1259 OID 102365)
-- Name: messages_2025_09_25_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_09_25_inserted_at_topic_idx ON realtime.messages_2025_09_25 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 5060 (class 1259 OID 102366)
-- Name: messages_2025_09_26_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_09_26_inserted_at_topic_idx ON realtime.messages_2025_09_26 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 5063 (class 1259 OID 102376)
-- Name: messages_2025_09_27_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_09_27_inserted_at_topic_idx ON realtime.messages_2025_09_27 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 5066 (class 1259 OID 105121)
-- Name: messages_2025_09_28_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2025_09_28_inserted_at_topic_idx ON realtime.messages_2025_09_28 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 4818 (class 1259 OID 17171)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- TOC entry 4736 (class 1259 OID 16560)
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 4739 (class 1259 OID 16582)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 4810 (class 1259 OID 17074)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 4740 (class 1259 OID 68448)
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- TOC entry 4741 (class 1259 OID 17039)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 4742 (class 1259 OID 68450)
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- TOC entry 5018 (class 1259 OID 68451)
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- TOC entry 4743 (class 1259 OID 16583)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 4744 (class 1259 OID 68449)
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- TOC entry 5075 (class 0 OID 0)
-- Name: messages_2025_09_22_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_09_22_inserted_at_topic_idx;


--
-- TOC entry 5076 (class 0 OID 0)
-- Name: messages_2025_09_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_22_pkey;


--
-- TOC entry 5077 (class 0 OID 0)
-- Name: messages_2025_09_23_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_09_23_inserted_at_topic_idx;


--
-- TOC entry 5078 (class 0 OID 0)
-- Name: messages_2025_09_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_23_pkey;


--
-- TOC entry 5079 (class 0 OID 0)
-- Name: messages_2025_09_24_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_09_24_inserted_at_topic_idx;


--
-- TOC entry 5080 (class 0 OID 0)
-- Name: messages_2025_09_24_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_24_pkey;


--
-- TOC entry 5081 (class 0 OID 0)
-- Name: messages_2025_09_25_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_09_25_inserted_at_topic_idx;


--
-- TOC entry 5082 (class 0 OID 0)
-- Name: messages_2025_09_25_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_25_pkey;


--
-- TOC entry 5083 (class 0 OID 0)
-- Name: messages_2025_09_26_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_09_26_inserted_at_topic_idx;


--
-- TOC entry 5084 (class 0 OID 0)
-- Name: messages_2025_09_26_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_26_pkey;


--
-- TOC entry 5085 (class 0 OID 0)
-- Name: messages_2025_09_27_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_09_27_inserted_at_topic_idx;


--
-- TOC entry 5086 (class 0 OID 0)
-- Name: messages_2025_09_27_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_27_pkey;


--
-- TOC entry 5087 (class 0 OID 0)
-- Name: messages_2025_09_28_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_09_28_inserted_at_topic_idx;


--
-- TOC entry 5088 (class 0 OID 0)
-- Name: messages_2025_09_28_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_28_pkey;


--
-- TOC entry 5260 (class 2620 OID 68083)
-- Name: cuenta_por_cobrar trg_calcular_dias_vencimiento; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_calcular_dias_vencimiento BEFORE INSERT OR UPDATE ON public.cuenta_por_cobrar FOR EACH ROW EXECUTE FUNCTION public.calcular_dias_vencimiento();


--
-- TOC entry 5257 (class 2620 OID 90384)
-- Name: cotizacion trg_cotizacion_cambio_estado; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_cotizacion_cambio_estado AFTER UPDATE OF id_estado ON public.cotizacion FOR EACH ROW WHEN ((old.id_estado IS DISTINCT FROM new.id_estado)) EXECUTE FUNCTION public.fn_registrar_transicion_estado_cotizacion();


--
-- TOC entry 5258 (class 2620 OID 68078)
-- Name: cotizacion trg_cotizacion_fecha_actualizacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_cotizacion_fecha_actualizacion BEFORE UPDATE ON public.cotizacion FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_modificacion();


--
-- TOC entry 5259 (class 2620 OID 90386)
-- Name: cotizacion trg_cotizacion_primera_transicion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_cotizacion_primera_transicion AFTER INSERT ON public.cotizacion FOR EACH ROW EXECUTE FUNCTION public.fn_registrar_primera_transicion();


--
-- TOC entry 5256 (class 2620 OID 68082)
-- Name: solicitud_cotizacion trg_generar_codigo_solicitud; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_generar_codigo_solicitud BEFORE INSERT ON public.solicitud_cotizacion FOR EACH ROW EXECUTE FUNCTION public.generar_codigo_solicitud();


--
-- TOC entry 5252 (class 2620 OID 68077)
-- Name: producto trg_producto_fecha_actualizacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_producto_fecha_actualizacion BEFORE UPDATE ON public.producto FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_modificacion();


--
-- TOC entry 5255 (class 2620 OID 68079)
-- Name: producto_proveedor trg_producto_proveedor_fecha_actualizacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_producto_proveedor_fecha_actualizacion BEFORE UPDATE ON public.producto_proveedor FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_modificacion();


--
-- TOC entry 5250 (class 2620 OID 68076)
-- Name: usuario trg_usuario_fecha_actualizacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_usuario_fecha_actualizacion BEFORE UPDATE ON public.usuario FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_modificacion();


--
-- TOC entry 5253 (class 2620 OID 106324)
-- Name: producto trigger_calcular_precio_multimoneda; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_calcular_precio_multimoneda AFTER INSERT OR UPDATE OF costo_proveedor, ultimo_tipo_cambio ON public.producto FOR EACH ROW EXECUTE FUNCTION public.calcular_precio_multimoneda_automatico();


--
-- TOC entry 5254 (class 2620 OID 78222)
-- Name: producto trigger_validar_margen_producto; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_validar_margen_producto BEFORE INSERT OR UPDATE OF margen_aplicado ON public.producto FOR EACH ROW EXECUTE FUNCTION public.validar_margen_producto();


--
-- TOC entry 5251 (class 2620 OID 68080)
-- Name: recogedores update_recogedores_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_recogedores_modtime BEFORE UPDATE ON public.recogedores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5249 (class 2620 OID 68081)
-- Name: vehicle_types update_vehicle_types_modtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_vehicle_types_modtime BEFORE UPDATE ON public.vehicle_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5248 (class 2620 OID 17126)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 5243 (class 2620 OID 68458)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- TOC entry 5244 (class 2620 OID 102332)
-- Name: objects objects_delete_cleanup; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_cleanup AFTER DELETE ON storage.objects REFERENCING OLD TABLE AS deleted FOR EACH STATEMENT EXECUTE FUNCTION storage.objects_delete_cleanup();


--
-- TOC entry 5245 (class 2620 OID 68444)
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- TOC entry 5246 (class 2620 OID 102334)
-- Name: objects objects_update_cleanup; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_cleanup AFTER UPDATE ON storage.objects REFERENCING OLD TABLE AS old_rows NEW TABLE AS new_rows FOR EACH STATEMENT EXECUTE FUNCTION storage.objects_update_cleanup();


--
-- TOC entry 5261 (class 2620 OID 68454)
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- TOC entry 5262 (class 2620 OID 102333)
-- Name: prefixes prefixes_delete_cleanup; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_cleanup AFTER DELETE ON storage.prefixes REFERENCING OLD TABLE AS deleted FOR EACH STATEMENT EXECUTE FUNCTION storage.prefixes_delete_cleanup();


--
-- TOC entry 5247 (class 2620 OID 17027)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 5091 (class 2606 OID 16732)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5095 (class 2606 OID 16821)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 5094 (class 2606 OID 16809)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 5093 (class 2606 OID 16796)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5100 (class 2606 OID 16987)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5089 (class 2606 OID 16765)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 5097 (class 2606 OID 16868)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 5098 (class 2606 OID 16941)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 5099 (class 2606 OID 16882)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 5092 (class 2606 OID 16760)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5096 (class 2606 OID 16849)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 5223 (class 2606 OID 67975)
-- Name: carrito_compra carrito_compra_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_compra
    ADD CONSTRAINT carrito_compra_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5224 (class 2606 OID 67985)
-- Name: carrito_compra carrito_compra_id_moneda_precio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_compra
    ADD CONSTRAINT carrito_compra_id_moneda_precio_fkey FOREIGN KEY (id_moneda_precio) REFERENCES public.moneda(id);


--
-- TOC entry 5225 (class 2606 OID 67980)
-- Name: carrito_compra carrito_compra_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_compra
    ADD CONSTRAINT carrito_compra_sku_fkey FOREIGN KEY (sku) REFERENCES public.producto(sku);


--
-- TOC entry 5105 (class 2606 OID 66661)
-- Name: ciudad ciudad_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id);


--
-- TOC entry 5112 (class 2606 OID 66885)
-- Name: cliente cliente_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id);


--
-- TOC entry 5113 (class 2606 OID 66875)
-- Name: cliente cliente_id_rubro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_id_rubro_fkey FOREIGN KEY (id_rubro) REFERENCES public.rubro(id);


--
-- TOC entry 5114 (class 2606 OID 66880)
-- Name: cliente cliente_id_tipo_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_id_tipo_cliente_fkey FOREIGN KEY (id_tipo_cliente) REFERENCES public.tipo_cliente(id);


--
-- TOC entry 5115 (class 2606 OID 89074)
-- Name: cliente cliente_id_tipo_contacto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_id_tipo_contacto_fkey FOREIGN KEY (id_tipo_contacto) REFERENCES public.tipo_contacto(id);


--
-- TOC entry 5154 (class 2606 OID 67335)
-- Name: comunicacion_solicitud comunicacion_solicitud_id_solicitud_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comunicacion_solicitud
    ADD CONSTRAINT comunicacion_solicitud_id_solicitud_cotizacion_fkey FOREIGN KEY (id_solicitud_cotizacion) REFERENCES public.solicitud_cotizacion(id);


--
-- TOC entry 5155 (class 2606 OID 67340)
-- Name: comunicacion_solicitud comunicacion_solicitud_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comunicacion_solicitud
    ADD CONSTRAINT comunicacion_solicitud_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id);


--
-- TOC entry 5107 (class 2606 OID 66758)
-- Name: condiciones_comerciales condiciones_comerciales_id_moneda_min_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condiciones_comerciales
    ADD CONSTRAINT condiciones_comerciales_id_moneda_min_pedido_fkey FOREIGN KEY (id_moneda_min_pedido) REFERENCES public.moneda(id);


--
-- TOC entry 5121 (class 2606 OID 67013)
-- Name: configuracion_fe configuracion_fe_configurado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_fe
    ADD CONSTRAINT configuracion_fe_configurado_por_fkey FOREIGN KEY (configurado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5122 (class 2606 OID 67008)
-- Name: configuracion_fe configuracion_fe_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_fe
    ADD CONSTRAINT configuracion_fe_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id);


--
-- TOC entry 5232 (class 2606 OID 68047)
-- Name: costos_operativos costos_operativos_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costos_operativos
    ADD CONSTRAINT costos_operativos_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id);


--
-- TOC entry 5233 (class 2606 OID 68052)
-- Name: costos_operativos costos_operativos_responsable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costos_operativos
    ADD CONSTRAINT costos_operativos_responsable_fkey FOREIGN KEY (responsable) REFERENCES public.usuario(id);


--
-- TOC entry 5175 (class 2606 OID 67585)
-- Name: cotizacion cotizacion_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5183 (class 2606 OID 67614)
-- Name: cotizacion_detalle cotizacion_detalle_id_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_detalle
    ADD CONSTRAINT cotizacion_detalle_id_cotizacion_fkey FOREIGN KEY (id_cotizacion) REFERENCES public.cotizacion(id) ON DELETE CASCADE;


--
-- TOC entry 5184 (class 2606 OID 67634)
-- Name: cotizacion_detalle cotizacion_detalle_id_moneda_costo_proveedor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_detalle
    ADD CONSTRAINT cotizacion_detalle_id_moneda_costo_proveedor_fkey FOREIGN KEY (id_moneda_costo_proveedor) REFERENCES public.moneda(id);


--
-- TOC entry 5185 (class 2606 OID 67629)
-- Name: cotizacion_detalle cotizacion_detalle_id_proveedor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_detalle
    ADD CONSTRAINT cotizacion_detalle_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id);


--
-- TOC entry 5186 (class 2606 OID 67624)
-- Name: cotizacion_detalle cotizacion_detalle_id_proveedor_principal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_detalle
    ADD CONSTRAINT cotizacion_detalle_id_proveedor_principal_fkey FOREIGN KEY (id_proveedor_principal) REFERENCES public.proveedor(id);


--
-- TOC entry 5187 (class 2606 OID 67619)
-- Name: cotizacion_detalle cotizacion_detalle_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_detalle
    ADD CONSTRAINT cotizacion_detalle_sku_fkey FOREIGN KEY (sku) REFERENCES public.producto(sku);


--
-- TOC entry 5176 (class 2606 OID 67565)
-- Name: cotizacion cotizacion_id_asesor_ventas_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_asesor_ventas_fkey FOREIGN KEY (id_asesor_ventas) REFERENCES public.usuario(id);


--
-- TOC entry 5177 (class 2606 OID 67560)
-- Name: cotizacion cotizacion_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5178 (class 2606 OID 67575)
-- Name: cotizacion cotizacion_id_condiciones_comerciales_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_condiciones_comerciales_fkey FOREIGN KEY (id_condiciones_comerciales) REFERENCES public.condiciones_comerciales(id);


--
-- TOC entry 5179 (class 2606 OID 86707)
-- Name: cotizacion cotizacion_id_disponibilidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_disponibilidad_fkey FOREIGN KEY (id_disponibilidad) REFERENCES public.disponibilidad(id);


--
-- TOC entry 5180 (class 2606 OID 86658)
-- Name: cotizacion cotizacion_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado_cotizacion(id);


--
-- TOC entry 5181 (class 2606 OID 67570)
-- Name: cotizacion cotizacion_id_forma_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_forma_pago_fkey FOREIGN KEY (id_forma_pago) REFERENCES public.forma_pago(id);


--
-- TOC entry 5182 (class 2606 OID 67580)
-- Name: cotizacion cotizacion_id_moneda_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_moneda_cotizacion_fkey FOREIGN KEY (id_moneda_cotizacion) REFERENCES public.moneda(id);


--
-- TOC entry 5164 (class 2606 OID 67484)
-- Name: crm_actividad crm_actividad_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_actividad
    ADD CONSTRAINT crm_actividad_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5165 (class 2606 OID 67459)
-- Name: crm_actividad crm_actividad_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_actividad
    ADD CONSTRAINT crm_actividad_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5166 (class 2606 OID 67464)
-- Name: crm_actividad crm_actividad_id_oportunidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_actividad
    ADD CONSTRAINT crm_actividad_id_oportunidad_fkey FOREIGN KEY (id_oportunidad) REFERENCES public.oportunidad(id);


--
-- TOC entry 5167 (class 2606 OID 67469)
-- Name: crm_actividad crm_actividad_id_solicitud_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_actividad
    ADD CONSTRAINT crm_actividad_id_solicitud_cotizacion_fkey FOREIGN KEY (id_solicitud_cotizacion) REFERENCES public.solicitud_cotizacion(id);


--
-- TOC entry 5168 (class 2606 OID 67474)
-- Name: crm_actividad crm_actividad_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_actividad
    ADD CONSTRAINT crm_actividad_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id);


--
-- TOC entry 5169 (class 2606 OID 67479)
-- Name: crm_actividad crm_actividad_id_usuario_responsable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_actividad
    ADD CONSTRAINT crm_actividad_id_usuario_responsable_fkey FOREIGN KEY (id_usuario_responsable) REFERENCES public.usuario(id);


--
-- TOC entry 5170 (class 2606 OID 67516)
-- Name: crm_nota crm_nota_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_nota
    ADD CONSTRAINT crm_nota_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5171 (class 2606 OID 67511)
-- Name: crm_nota crm_nota_id_actividad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_nota
    ADD CONSTRAINT crm_nota_id_actividad_fkey FOREIGN KEY (id_actividad) REFERENCES public.crm_actividad(id);


--
-- TOC entry 5172 (class 2606 OID 67501)
-- Name: crm_nota crm_nota_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_nota
    ADD CONSTRAINT crm_nota_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5173 (class 2606 OID 67506)
-- Name: crm_nota crm_nota_id_oportunidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_nota
    ADD CONSTRAINT crm_nota_id_oportunidad_fkey FOREIGN KEY (id_oportunidad) REFERENCES public.oportunidad(id);


--
-- TOC entry 5174 (class 2606 OID 67521)
-- Name: crm_nota crm_nota_modificado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_nota
    ADD CONSTRAINT crm_nota_modificado_por_fkey FOREIGN KEY (modificado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5221 (class 2606 OID 67956)
-- Name: crowdlending_operacion crowdlending_operacion_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crowdlending_operacion
    ADD CONSTRAINT crowdlending_operacion_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5222 (class 2606 OID 67951)
-- Name: crowdlending_operacion crowdlending_operacion_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crowdlending_operacion
    ADD CONSTRAINT crowdlending_operacion_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedido(id);


--
-- TOC entry 5209 (class 2606 OID 67866)
-- Name: cuenta_por_cobrar cuenta_por_cobrar_gestor_cobranza_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_por_cobrar
    ADD CONSTRAINT cuenta_por_cobrar_gestor_cobranza_fkey FOREIGN KEY (gestor_cobranza) REFERENCES public.usuario(id);


--
-- TOC entry 5210 (class 2606 OID 67851)
-- Name: cuenta_por_cobrar cuenta_por_cobrar_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_por_cobrar
    ADD CONSTRAINT cuenta_por_cobrar_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5211 (class 2606 OID 67846)
-- Name: cuenta_por_cobrar cuenta_por_cobrar_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_por_cobrar
    ADD CONSTRAINT cuenta_por_cobrar_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id);


--
-- TOC entry 5212 (class 2606 OID 67861)
-- Name: cuenta_por_cobrar cuenta_por_cobrar_id_gestor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_por_cobrar
    ADD CONSTRAINT cuenta_por_cobrar_id_gestor_fkey FOREIGN KEY (id_gestor) REFERENCES public.usuario(id);


--
-- TOC entry 5213 (class 2606 OID 67856)
-- Name: cuenta_por_cobrar cuenta_por_cobrar_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_por_cobrar
    ADD CONSTRAINT cuenta_por_cobrar_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id);


--
-- TOC entry 5157 (class 2606 OID 67383)
-- Name: detalle_solicitud_cotizacion detalle_solicitud_cotizacion_id_solicitud_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_solicitud_cotizacion
    ADD CONSTRAINT detalle_solicitud_cotizacion_id_solicitud_cotizacion_fkey FOREIGN KEY (id_solicitud_cotizacion) REFERENCES public.solicitud_cotizacion(id) ON DELETE CASCADE;


--
-- TOC entry 5158 (class 2606 OID 67388)
-- Name: detalle_solicitud_cotizacion detalle_solicitud_cotizacion_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_solicitud_cotizacion
    ADD CONSTRAINT detalle_solicitud_cotizacion_sku_fkey FOREIGN KEY (sku) REFERENCES public.producto(sku);


--
-- TOC entry 5146 (class 2606 OID 67262)
-- Name: direccion_cliente direccion_cliente_id_ciudad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion_cliente
    ADD CONSTRAINT direccion_cliente_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES public.ciudad(id);


--
-- TOC entry 5147 (class 2606 OID 67257)
-- Name: direccion_cliente direccion_cliente_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion_cliente
    ADD CONSTRAINT direccion_cliente_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id) ON DELETE CASCADE;


--
-- TOC entry 5148 (class 2606 OID 67267)
-- Name: direccion_cliente direccion_cliente_id_distrito_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion_cliente
    ADD CONSTRAINT direccion_cliente_id_distrito_fkey FOREIGN KEY (id_distrito) REFERENCES public.distrito(id);


--
-- TOC entry 5149 (class 2606 OID 67272)
-- Name: direccion_cliente direccion_cliente_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion_cliente
    ADD CONSTRAINT direccion_cliente_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id);


--
-- TOC entry 5106 (class 2606 OID 66676)
-- Name: distrito distrito_id_ciudad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distrito
    ADD CONSTRAINT distrito_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES public.ciudad(id);


--
-- TOC entry 5116 (class 2606 OID 66903)
-- Name: empresa_emisora empresa_emisora_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_emisora
    ADD CONSTRAINT empresa_emisora_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id);


--
-- TOC entry 5220 (class 2606 OID 67930)
-- Name: factoring_operacion factoring_operacion_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factoring_operacion
    ADD CONSTRAINT factoring_operacion_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id);


--
-- TOC entry 5200 (class 2606 OID 67796)
-- Name: factura factura_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5207 (class 2606 OID 67817)
-- Name: factura_detalle factura_detalle_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_detalle
    ADD CONSTRAINT factura_detalle_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id) ON DELETE CASCADE;


--
-- TOC entry 5208 (class 2606 OID 67822)
-- Name: factura_detalle factura_detalle_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_detalle
    ADD CONSTRAINT factura_detalle_sku_fkey FOREIGN KEY (sku) REFERENCES public.producto(sku);


--
-- TOC entry 5201 (class 2606 OID 67791)
-- Name: factura factura_facturado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_facturado_por_fkey FOREIGN KEY (facturado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5202 (class 2606 OID 67776)
-- Name: factura factura_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5203 (class 2606 OID 67766)
-- Name: factura factura_id_empresa_emisora_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_empresa_emisora_fkey FOREIGN KEY (id_empresa_emisora) REFERENCES public.empresa_emisora(id);


--
-- TOC entry 5204 (class 2606 OID 67781)
-- Name: factura factura_id_forma_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_forma_pago_fkey FOREIGN KEY (id_forma_pago) REFERENCES public.forma_pago(id);


--
-- TOC entry 5205 (class 2606 OID 67786)
-- Name: factura factura_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id);


--
-- TOC entry 5206 (class 2606 OID 67771)
-- Name: factura factura_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedido(id);


--
-- TOC entry 5150 (class 2606 OID 67590)
-- Name: solicitud_cotizacion fk_solicitud_cotizacion_generada; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cotizacion
    ADD CONSTRAINT fk_solicitud_cotizacion_generada FOREIGN KEY (id_cotizacion_generada) REFERENCES public.cotizacion(id);


--
-- TOC entry 5226 (class 2606 OID 68015)
-- Name: historial_precios historial_precios_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_precios
    ADD CONSTRAINT historial_precios_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id);


--
-- TOC entry 5227 (class 2606 OID 68010)
-- Name: historial_precios historial_precios_id_proveedor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_precios
    ADD CONSTRAINT historial_precios_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id);


--
-- TOC entry 5228 (class 2606 OID 68025)
-- Name: historial_precios historial_precios_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_precios
    ADD CONSTRAINT historial_precios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id);


--
-- TOC entry 5229 (class 2606 OID 68030)
-- Name: historial_precios historial_precios_referencia_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_precios
    ADD CONSTRAINT historial_precios_referencia_cotizacion_fkey FOREIGN KEY (referencia_cotizacion) REFERENCES public.cotizacion(id);


--
-- TOC entry 5230 (class 2606 OID 68005)
-- Name: historial_precios historial_precios_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_precios
    ADD CONSTRAINT historial_precios_sku_fkey FOREIGN KEY (sku) REFERENCES public.producto(sku);


--
-- TOC entry 5231 (class 2606 OID 68020)
-- Name: historial_precios historial_precios_usuario_responsable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_precios
    ADD CONSTRAINT historial_precios_usuario_responsable_fkey FOREIGN KEY (usuario_responsable) REFERENCES public.usuario(id);


--
-- TOC entry 5234 (class 2606 OID 68066)
-- Name: inversion_categoria inversion_categoria_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inversion_categoria
    ADD CONSTRAINT inversion_categoria_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categoria(id);


--
-- TOC entry 5235 (class 2606 OID 68071)
-- Name: inversion_categoria inversion_categoria_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inversion_categoria
    ADD CONSTRAINT inversion_categoria_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id);


--
-- TOC entry 5123 (class 2606 OID 67031)
-- Name: marca_categoria marca_categoria_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marca_categoria
    ADD CONSTRAINT marca_categoria_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categoria(id) ON DELETE CASCADE;


--
-- TOC entry 5124 (class 2606 OID 67026)
-- Name: marca_categoria marca_categoria_id_marca_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marca_categoria
    ADD CONSTRAINT marca_categoria_id_marca_fkey FOREIGN KEY (id_marca) REFERENCES public.marca(id) ON DELETE CASCADE;


--
-- TOC entry 5159 (class 2606 OID 67424)
-- Name: oportunidad oportunidad_id_asesor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oportunidad
    ADD CONSTRAINT oportunidad_id_asesor_fkey FOREIGN KEY (id_asesor) REFERENCES public.usuario(id);


--
-- TOC entry 5160 (class 2606 OID 67414)
-- Name: oportunidad oportunidad_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oportunidad
    ADD CONSTRAINT oportunidad_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5161 (class 2606 OID 67429)
-- Name: oportunidad oportunidad_id_etapa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oportunidad
    ADD CONSTRAINT oportunidad_id_etapa_fkey FOREIGN KEY (id_etapa) REFERENCES public.crm_etapa(id);


--
-- TOC entry 5162 (class 2606 OID 67434)
-- Name: oportunidad oportunidad_id_moneda_valor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oportunidad
    ADD CONSTRAINT oportunidad_id_moneda_valor_fkey FOREIGN KEY (id_moneda_valor) REFERENCES public.moneda(id);


--
-- TOC entry 5163 (class 2606 OID 67419)
-- Name: oportunidad oportunidad_id_solicitud_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oportunidad
    ADD CONSTRAINT oportunidad_id_solicitud_cotizacion_fkey FOREIGN KEY (id_solicitud_cotizacion) REFERENCES public.solicitud_cotizacion(id);


--
-- TOC entry 5214 (class 2606 OID 67892)
-- Name: pago_recibido pago_recibido_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_recibido
    ADD CONSTRAINT pago_recibido_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5215 (class 2606 OID 67887)
-- Name: pago_recibido pago_recibido_id_cuenta_por_cobrar_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_recibido
    ADD CONSTRAINT pago_recibido_id_cuenta_por_cobrar_fkey FOREIGN KEY (id_cuenta_por_cobrar) REFERENCES public.cuenta_por_cobrar(id);


--
-- TOC entry 5216 (class 2606 OID 67897)
-- Name: pago_recibido pago_recibido_id_forma_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_recibido
    ADD CONSTRAINT pago_recibido_id_forma_pago_fkey FOREIGN KEY (id_forma_pago) REFERENCES public.forma_pago(id);


--
-- TOC entry 5217 (class 2606 OID 67902)
-- Name: pago_recibido pago_recibido_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_recibido
    ADD CONSTRAINT pago_recibido_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id);


--
-- TOC entry 5218 (class 2606 OID 67912)
-- Name: pago_recibido pago_recibido_recibido_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_recibido
    ADD CONSTRAINT pago_recibido_recibido_por_fkey FOREIGN KEY (recibido_por) REFERENCES public.usuario(id);


--
-- TOC entry 5219 (class 2606 OID 67907)
-- Name: pago_recibido pago_recibido_registrado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_recibido
    ADD CONSTRAINT pago_recibido_registrado_por_fkey FOREIGN KEY (registrado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5104 (class 2606 OID 66647)
-- Name: pais pais_id_moneda_principal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_id_moneda_principal_fkey FOREIGN KEY (id_moneda_principal) REFERENCES public.moneda(id);


--
-- TOC entry 5197 (class 2606 OID 67727)
-- Name: pedido_detalle pedido_detalle_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_detalle
    ADD CONSTRAINT pedido_detalle_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedido(id) ON DELETE CASCADE;


--
-- TOC entry 5198 (class 2606 OID 67737)
-- Name: pedido_detalle pedido_detalle_id_proveedor_asignado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_detalle
    ADD CONSTRAINT pedido_detalle_id_proveedor_asignado_fkey FOREIGN KEY (id_proveedor_asignado) REFERENCES public.proveedor(id);


--
-- TOC entry 5199 (class 2606 OID 67732)
-- Name: pedido_detalle pedido_detalle_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_detalle
    ADD CONSTRAINT pedido_detalle_sku_fkey FOREIGN KEY (sku) REFERENCES public.producto(sku);


--
-- TOC entry 5188 (class 2606 OID 67689)
-- Name: pedido pedido_id_asesor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_asesor_fkey FOREIGN KEY (id_asesor) REFERENCES public.usuario(id);


--
-- TOC entry 5189 (class 2606 OID 67684)
-- Name: pedido pedido_id_asesor_ventas_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_asesor_ventas_fkey FOREIGN KEY (id_asesor_ventas) REFERENCES public.usuario(id);


--
-- TOC entry 5190 (class 2606 OID 67669)
-- Name: pedido pedido_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5191 (class 2606 OID 67699)
-- Name: pedido pedido_id_condiciones_comerciales_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_condiciones_comerciales_fkey FOREIGN KEY (id_condiciones_comerciales) REFERENCES public.condiciones_comerciales(id);


--
-- TOC entry 5192 (class 2606 OID 67664)
-- Name: pedido pedido_id_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_cotizacion_fkey FOREIGN KEY (id_cotizacion) REFERENCES public.cotizacion(id);


--
-- TOC entry 5193 (class 2606 OID 67674)
-- Name: pedido pedido_id_direccion_envio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_direccion_envio_fkey FOREIGN KEY (id_direccion_envio) REFERENCES public.direccion_cliente(id);


--
-- TOC entry 5194 (class 2606 OID 67679)
-- Name: pedido pedido_id_direccion_facturacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_direccion_facturacion_fkey FOREIGN KEY (id_direccion_facturacion) REFERENCES public.direccion_cliente(id);


--
-- TOC entry 5195 (class 2606 OID 67694)
-- Name: pedido pedido_id_forma_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_forma_pago_fkey FOREIGN KEY (id_forma_pago) REFERENCES public.forma_pago(id);


--
-- TOC entry 5196 (class 2606 OID 67704)
-- Name: pedido pedido_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id);


--
-- TOC entry 5129 (class 2606 OID 67149)
-- Name: producto producto_actualizado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_actualizado_por_fkey FOREIGN KEY (actualizado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5130 (class 2606 OID 67144)
-- Name: producto producto_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5131 (class 2606 OID 67104)
-- Name: producto producto_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categoria(id);


--
-- TOC entry 5132 (class 2606 OID 67119)
-- Name: producto producto_id_disponibilidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_id_disponibilidad_fkey FOREIGN KEY (id_disponibilidad) REFERENCES public.disponibilidad(id);


--
-- TOC entry 5133 (class 2606 OID 67109)
-- Name: producto producto_id_marca_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_id_marca_fkey FOREIGN KEY (id_marca) REFERENCES public.marca(id);


--
-- TOC entry 5134 (class 2606 OID 67129)
-- Name: producto producto_id_moneda_costo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_id_moneda_costo_fkey FOREIGN KEY (id_moneda_costo) REFERENCES public.moneda(id);


--
-- TOC entry 5135 (class 2606 OID 67124)
-- Name: producto producto_id_moneda_referencia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_id_moneda_referencia_fkey FOREIGN KEY (id_moneda_referencia) REFERENCES public.moneda(id);


--
-- TOC entry 5136 (class 2606 OID 67134)
-- Name: producto producto_id_moneda_venta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_id_moneda_venta_fkey FOREIGN KEY (id_moneda_venta) REFERENCES public.moneda(id);


--
-- TOC entry 5137 (class 2606 OID 67139)
-- Name: producto producto_id_proveedor_principal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_id_proveedor_principal_fkey FOREIGN KEY (id_proveedor_principal) REFERENCES public.proveedor(id);


--
-- TOC entry 5138 (class 2606 OID 67114)
-- Name: producto producto_id_unidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_id_unidad_fkey FOREIGN KEY (id_unidad) REFERENCES public.unidad(id);


--
-- TOC entry 5241 (class 2606 OID 106239)
-- Name: producto_precio_moneda producto_precio_moneda_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_precio_moneda
    ADD CONSTRAINT producto_precio_moneda_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id);


--
-- TOC entry 5242 (class 2606 OID 106234)
-- Name: producto_precio_moneda producto_precio_moneda_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_precio_moneda
    ADD CONSTRAINT producto_precio_moneda_sku_fkey FOREIGN KEY (sku) REFERENCES public.producto(sku);


--
-- TOC entry 5139 (class 2606 OID 67182)
-- Name: producto_proveedor producto_proveedor_id_moneda_costo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_proveedor
    ADD CONSTRAINT producto_proveedor_id_moneda_costo_fkey FOREIGN KEY (id_moneda_costo) REFERENCES public.moneda(id);


--
-- TOC entry 5140 (class 2606 OID 67177)
-- Name: producto_proveedor producto_proveedor_id_proveedor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_proveedor
    ADD CONSTRAINT producto_proveedor_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id) ON DELETE CASCADE;


--
-- TOC entry 5141 (class 2606 OID 67172)
-- Name: producto_proveedor producto_proveedor_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_proveedor
    ADD CONSTRAINT producto_proveedor_sku_fkey FOREIGN KEY (sku) REFERENCES public.producto(sku) ON DELETE CASCADE;


--
-- TOC entry 5142 (class 2606 OID 67202)
-- Name: promocion promocion_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion
    ADD CONSTRAINT promocion_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5143 (class 2606 OID 67218)
-- Name: promocion_descuento promocion_descuento_id_promocion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion_descuento
    ADD CONSTRAINT promocion_descuento_id_promocion_fkey FOREIGN KEY (id_promocion) REFERENCES public.promocion(id);


--
-- TOC entry 5144 (class 2606 OID 67237)
-- Name: promocion_uso promocion_uso_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion_uso
    ADD CONSTRAINT promocion_uso_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 5145 (class 2606 OID 67232)
-- Name: promocion_uso promocion_uso_id_promocion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion_uso
    ADD CONSTRAINT promocion_uso_id_promocion_fkey FOREIGN KEY (id_promocion) REFERENCES public.promocion(id);


--
-- TOC entry 5127 (class 2606 OID 67068)
-- Name: proveedor_categoria proveedor_categoria_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor_categoria
    ADD CONSTRAINT proveedor_categoria_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categoria(id);


--
-- TOC entry 5128 (class 2606 OID 67063)
-- Name: proveedor_categoria proveedor_categoria_id_proveedor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor_categoria
    ADD CONSTRAINT proveedor_categoria_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id) ON DELETE CASCADE;


--
-- TOC entry 5117 (class 2606 OID 66931)
-- Name: proveedor proveedor_id_ciudad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES public.ciudad(id);


--
-- TOC entry 5118 (class 2606 OID 66941)
-- Name: proveedor proveedor_id_condiciones_comerciales_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_id_condiciones_comerciales_fkey FOREIGN KEY (id_condiciones_comerciales) REFERENCES public.condiciones_comerciales(id);


--
-- TOC entry 5119 (class 2606 OID 66936)
-- Name: proveedor proveedor_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id);


--
-- TOC entry 5125 (class 2606 OID 67050)
-- Name: proveedor_marca proveedor_marca_id_marca_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor_marca
    ADD CONSTRAINT proveedor_marca_id_marca_fkey FOREIGN KEY (id_marca) REFERENCES public.marca(id);


--
-- TOC entry 5126 (class 2606 OID 67045)
-- Name: proveedor_marca proveedor_marca_id_proveedor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor_marca
    ADD CONSTRAINT proveedor_marca_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id) ON DELETE CASCADE;


--
-- TOC entry 5120 (class 2606 OID 66963)
-- Name: recogedores recogedores_id_vehicle_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recogedores
    ADD CONSTRAINT recogedores_id_vehicle_type_fkey FOREIGN KEY (id_vehicle_type) REFERENCES public.vehicle_types(id);


--
-- TOC entry 5156 (class 2606 OID 67353)
-- Name: solicitud_archivo solicitud_archivo_id_solicitud_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_archivo
    ADD CONSTRAINT solicitud_archivo_id_solicitud_cotizacion_fkey FOREIGN KEY (id_solicitud_cotizacion) REFERENCES public.solicitud_cotizacion(id);


--
-- TOC entry 5151 (class 2606 OID 67317)
-- Name: solicitud_cotizacion solicitud_cotizacion_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cotizacion
    ADD CONSTRAINT solicitud_cotizacion_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5152 (class 2606 OID 67307)
-- Name: solicitud_cotizacion solicitud_cotizacion_id_asesor_asignado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cotizacion
    ADD CONSTRAINT solicitud_cotizacion_id_asesor_asignado_fkey FOREIGN KEY (id_asesor_asignado) REFERENCES public.usuario(id);


--
-- TOC entry 5153 (class 2606 OID 67312)
-- Name: solicitud_cotizacion solicitud_cotizacion_id_cliente_creado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_cotizacion
    ADD CONSTRAINT solicitud_cotizacion_id_cliente_creado_fkey FOREIGN KEY (id_cliente_creado) REFERENCES public.cliente(id);


--
-- TOC entry 5237 (class 2606 OID 90362)
-- Name: transicion_estado_cotizacion transicion_estado_cotizacion_estado_anterior_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transicion_estado_cotizacion
    ADD CONSTRAINT transicion_estado_cotizacion_estado_anterior_id_fkey FOREIGN KEY (estado_anterior_id) REFERENCES public.estado_cotizacion(id);


--
-- TOC entry 5238 (class 2606 OID 90367)
-- Name: transicion_estado_cotizacion transicion_estado_cotizacion_estado_nuevo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transicion_estado_cotizacion
    ADD CONSTRAINT transicion_estado_cotizacion_estado_nuevo_id_fkey FOREIGN KEY (estado_nuevo_id) REFERENCES public.estado_cotizacion(id);


--
-- TOC entry 5239 (class 2606 OID 90357)
-- Name: transicion_estado_cotizacion transicion_estado_cotizacion_id_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transicion_estado_cotizacion
    ADD CONSTRAINT transicion_estado_cotizacion_id_cotizacion_fkey FOREIGN KEY (id_cotizacion) REFERENCES public.cotizacion(id) ON DELETE CASCADE;


--
-- TOC entry 5240 (class 2606 OID 90372)
-- Name: transicion_estado_cotizacion transicion_estado_cotizacion_usuario_responsable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transicion_estado_cotizacion
    ADD CONSTRAINT transicion_estado_cotizacion_usuario_responsable_fkey FOREIGN KEY (usuario_responsable) REFERENCES public.usuario(id);


--
-- TOC entry 5108 (class 2606 OID 68230)
-- Name: usuario usuario_auth_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id);


--
-- TOC entry 5109 (class 2606 OID 66858)
-- Name: usuario_rol usuario_rol_asignado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_asignado_por_fkey FOREIGN KEY (asignado_por) REFERENCES public.usuario(id);


--
-- TOC entry 5110 (class 2606 OID 66853)
-- Name: usuario_rol usuario_rol_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id);


--
-- TOC entry 5111 (class 2606 OID 66848)
-- Name: usuario_rol usuario_rol_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_rol
    ADD CONSTRAINT usuario_rol_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 5090 (class 2606 OID 16572)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5236 (class 2606 OID 68431)
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5101 (class 2606 OID 17049)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5102 (class 2606 OID 17069)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5103 (class 2606 OID 17064)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 5425 (class 0 OID 16525)
-- Dependencies: 356
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5439 (class 0 OID 16927)
-- Dependencies: 373
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5430 (class 0 OID 16725)
-- Dependencies: 364
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5424 (class 0 OID 16518)
-- Dependencies: 355
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5434 (class 0 OID 16814)
-- Dependencies: 368
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5433 (class 0 OID 16802)
-- Dependencies: 367
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5432 (class 0 OID 16789)
-- Dependencies: 366
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5440 (class 0 OID 16977)
-- Dependencies: 374
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5423 (class 0 OID 16507)
-- Dependencies: 354
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5437 (class 0 OID 16856)
-- Dependencies: 371
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5438 (class 0 OID 16874)
-- Dependencies: 372
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5426 (class 0 OID 16533)
-- Dependencies: 357
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5431 (class 0 OID 16755)
-- Dependencies: 365
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5436 (class 0 OID 16841)
-- Dependencies: 370
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5435 (class 0 OID 16832)
-- Dependencies: 369
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5422 (class 0 OID 16495)
-- Dependencies: 352
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5485 (class 3256 OID 70385)
-- Name: marca Allow public read access to marca; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to marca" ON public.marca FOR SELECT USING (true);


--
-- TOC entry 5486 (class 3256 OID 70386)
-- Name: moneda Allow public read access to moneda; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to moneda" ON public.moneda FOR SELECT USING (true);


--
-- TOC entry 5484 (class 3256 OID 70384)
-- Name: pais Allow public read access to pais; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to pais" ON public.pais FOR SELECT USING (true);


--
-- TOC entry 5469 (class 3256 OID 68760)
-- Name: producto Usuarios autenticados pueden actualizar productos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden actualizar productos" ON public.producto FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- TOC entry 5478 (class 3256 OID 68769)
-- Name: usuario Usuarios autenticados pueden actualizar usuarios; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden actualizar usuarios" ON public.usuario FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


--
-- TOC entry 5471 (class 3256 OID 68762)
-- Name: categoria Usuarios autenticados pueden crear categorias; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden crear categorias" ON public.categoria FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 5483 (class 3256 OID 68775)
-- Name: cliente Usuarios autenticados pueden crear clientes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden crear clientes" ON public.cliente FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 5473 (class 3256 OID 68764)
-- Name: marca Usuarios autenticados pueden crear marcas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden crear marcas" ON public.marca FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 5468 (class 3256 OID 68759)
-- Name: producto Usuarios autenticados pueden crear productos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden crear productos" ON public.producto FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 5475 (class 3256 OID 68766)
-- Name: proveedor Usuarios autenticados pueden crear proveedores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden crear proveedores" ON public.proveedor FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 5470 (class 3256 OID 68761)
-- Name: categoria Usuarios autenticados pueden leer categorias; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer categorias" ON public.categoria FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5482 (class 3256 OID 68774)
-- Name: cliente Usuarios autenticados pueden leer clientes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer clientes" ON public.cliente FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5480 (class 3256 OID 68772)
-- Name: disponibilidad Usuarios autenticados pueden leer disponibilidad; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer disponibilidad" ON public.disponibilidad FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5472 (class 3256 OID 68763)
-- Name: marca Usuarios autenticados pueden leer marcas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer marcas" ON public.marca FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5481 (class 3256 OID 68773)
-- Name: moneda Usuarios autenticados pueden leer monedas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer monedas" ON public.moneda FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5467 (class 3256 OID 68758)
-- Name: producto Usuarios autenticados pueden leer productos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer productos" ON public.producto FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5474 (class 3256 OID 68765)
-- Name: proveedor Usuarios autenticados pueden leer proveedores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer proveedores" ON public.proveedor FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5476 (class 3256 OID 68767)
-- Name: rol Usuarios autenticados pueden leer roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer roles" ON public.rol FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5459 (class 3256 OID 68771)
-- Name: unidad Usuarios autenticados pueden leer unidades; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer unidades" ON public.unidad FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5479 (class 3256 OID 68770)
-- Name: usuario_rol Usuarios autenticados pueden leer usuario_rol; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer usuario_rol" ON public.usuario_rol FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5477 (class 3256 OID 68768)
-- Name: usuario Usuarios autenticados pueden leer usuarios; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuarios autenticados pueden leer usuarios" ON public.usuario FOR SELECT TO authenticated USING (true);


--
-- TOC entry 5446 (class 3256 OID 68578)
-- Name: categoria authenticated_users_can_read_categoria; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_read_categoria ON public.categoria FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5458 (class 3256 OID 68590)
-- Name: disponibilidad authenticated_users_can_read_disponibilidad; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_read_disponibilidad ON public.disponibilidad FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5448 (class 3256 OID 68580)
-- Name: marca authenticated_users_can_read_marca; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_read_marca ON public.marca FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5454 (class 3256 OID 68586)
-- Name: moneda authenticated_users_can_read_moneda; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_read_moneda ON public.moneda FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5461 (class 3256 OID 68592)
-- Name: producto authenticated_users_can_read_producto; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_read_producto ON public.producto FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5450 (class 3256 OID 68582)
-- Name: proveedor authenticated_users_can_read_proveedor; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_read_proveedor ON public.proveedor FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5452 (class 3256 OID 68584)
-- Name: rol authenticated_users_can_read_rol; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_read_rol ON public.rol FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5456 (class 3256 OID 68588)
-- Name: unidad authenticated_users_can_read_unidad; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_read_unidad ON public.unidad FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5463 (class 3256 OID 68594)
-- Name: usuario authenticated_users_can_read_usuario; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_read_usuario ON public.usuario FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5465 (class 3256 OID 68596)
-- Name: usuario_rol authenticated_users_can_read_usuario_rol; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_read_usuario_rol ON public.usuario_rol FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5447 (class 3256 OID 68579)
-- Name: categoria authenticated_users_can_write_categoria; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_write_categoria ON public.categoria USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5460 (class 3256 OID 68591)
-- Name: disponibilidad authenticated_users_can_write_disponibilidad; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_write_disponibilidad ON public.disponibilidad USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5449 (class 3256 OID 68581)
-- Name: marca authenticated_users_can_write_marca; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_write_marca ON public.marca USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5455 (class 3256 OID 68587)
-- Name: moneda authenticated_users_can_write_moneda; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_write_moneda ON public.moneda USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5462 (class 3256 OID 68593)
-- Name: producto authenticated_users_can_write_producto; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_write_producto ON public.producto USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5451 (class 3256 OID 68583)
-- Name: proveedor authenticated_users_can_write_proveedor; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_write_proveedor ON public.proveedor USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5453 (class 3256 OID 68585)
-- Name: rol authenticated_users_can_write_rol; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_write_rol ON public.rol USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5457 (class 3256 OID 68589)
-- Name: unidad authenticated_users_can_write_unidad; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_write_unidad ON public.unidad USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5464 (class 3256 OID 68595)
-- Name: usuario authenticated_users_can_write_usuario; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_write_usuario ON public.usuario USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5466 (class 3256 OID 68597)
-- Name: usuario_rol authenticated_users_can_write_usuario_rol; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_write_usuario_rol ON public.usuario_rol USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 5443 (class 0 OID 17255)
-- Dependencies: 383
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5489 (class 3256 OID 94784)
-- Name: objects Actualizar imágenes productos - propietario; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Actualizar imágenes productos - propietario" ON storage.objects FOR UPDATE USING (((bucket_id = 'productos'::text) AND (auth.role() = 'authenticated'::text)));


--
-- TOC entry 5504 (class 3256 OID 97157)
-- Name: objects Authenticated delete for brand images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated delete for brand images" ON storage.objects FOR DELETE TO authenticated USING ((bucket_id = 'marcas-images'::text));


--
-- TOC entry 5505 (class 3256 OID 97158)
-- Name: objects Authenticated delete for category images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated delete for category images" ON storage.objects FOR DELETE TO authenticated USING ((bucket_id = 'categorias-images'::text));


--
-- TOC entry 5503 (class 3256 OID 97156)
-- Name: objects Authenticated delete for product images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated delete for product images" ON storage.objects FOR DELETE TO authenticated USING ((bucket_id = 'productos-images'::text));


--
-- TOC entry 5506 (class 3256 OID 97159)
-- Name: objects Authenticated delete for user avatars; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated delete for user avatars" ON storage.objects FOR DELETE TO authenticated USING ((bucket_id = 'usuarios-avatars'::text));


--
-- TOC entry 5501 (class 3256 OID 97153)
-- Name: objects Authenticated update for brand images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated update for brand images" ON storage.objects FOR UPDATE TO authenticated USING ((bucket_id = 'marcas-images'::text));


--
-- TOC entry 5502 (class 3256 OID 97154)
-- Name: objects Authenticated update for category images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated update for category images" ON storage.objects FOR UPDATE TO authenticated USING ((bucket_id = 'categorias-images'::text));


--
-- TOC entry 5500 (class 3256 OID 97152)
-- Name: objects Authenticated update for product images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated update for product images" ON storage.objects FOR UPDATE TO authenticated USING ((bucket_id = 'productos-images'::text));


--
-- TOC entry 5490 (class 3256 OID 97155)
-- Name: objects Authenticated update for user avatars; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated update for user avatars" ON storage.objects FOR UPDATE TO authenticated USING ((bucket_id = 'usuarios-avatars'::text));


--
-- TOC entry 5497 (class 3256 OID 97149)
-- Name: objects Authenticated upload for brand images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated upload for brand images" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'marcas-images'::text));


--
-- TOC entry 5498 (class 3256 OID 97150)
-- Name: objects Authenticated upload for category images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated upload for category images" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'categorias-images'::text));


--
-- TOC entry 5496 (class 3256 OID 97148)
-- Name: objects Authenticated upload for product images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated upload for product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'productos-images'::text));


--
-- TOC entry 5499 (class 3256 OID 97151)
-- Name: objects Authenticated upload for user avatars; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated upload for user avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'usuarios-avatars'::text));


--
-- TOC entry 5491 (class 3256 OID 94785)
-- Name: objects Eliminar imágenes productos - autenticado; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Eliminar imágenes productos - autenticado" ON storage.objects FOR DELETE USING (((bucket_id = 'productos'::text) AND (auth.role() = 'authenticated'::text)));


--
-- TOC entry 5487 (class 3256 OID 94782)
-- Name: objects Lectura pública de imágenes de productos; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Lectura pública de imágenes de productos" ON storage.objects FOR SELECT USING ((bucket_id = 'productos'::text));


--
-- TOC entry 5493 (class 3256 OID 97145)
-- Name: objects Public read access for brand images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public read access for brand images" ON storage.objects FOR SELECT USING ((bucket_id = 'marcas-images'::text));


--
-- TOC entry 5494 (class 3256 OID 97146)
-- Name: objects Public read access for category images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public read access for category images" ON storage.objects FOR SELECT USING ((bucket_id = 'categorias-images'::text));


--
-- TOC entry 5492 (class 3256 OID 97144)
-- Name: objects Public read access for product images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public read access for product images" ON storage.objects FOR SELECT USING ((bucket_id = 'productos-images'::text));


--
-- TOC entry 5495 (class 3256 OID 97147)
-- Name: objects Public read access for user avatars; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public read access for user avatars" ON storage.objects FOR SELECT USING ((bucket_id = 'usuarios-avatars'::text));


--
-- TOC entry 5488 (class 3256 OID 94783)
-- Name: objects Upload imágenes productos - usuarios autenticados; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Upload imágenes productos - usuarios autenticados" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'productos'::text) AND (auth.role() = 'authenticated'::text)));


--
-- TOC entry 5427 (class 0 OID 16546)
-- Dependencies: 358
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5445 (class 0 OID 68466)
-- Dependencies: 494
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5429 (class 0 OID 16588)
-- Dependencies: 360
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5428 (class 0 OID 16561)
-- Dependencies: 359
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5444 (class 0 OID 68421)
-- Dependencies: 493
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5441 (class 0 OID 17040)
-- Dependencies: 376
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5442 (class 0 OID 17054)
-- Dependencies: 377
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5507 (class 6104 OID 16426)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- TOC entry 5508 (class 6104 OID 90485)
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: supabase_admin
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime_messages_publication OWNER TO supabase_admin;

--
-- TOC entry 5509 (class 6106 OID 90486)
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: supabase_admin
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- TOC entry 5662 (class 0 OID 0)
-- Dependencies: 135
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- TOC entry 5663 (class 0 OID 0)
-- Dependencies: 24
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- TOC entry 5665 (class 0 OID 0)
-- Dependencies: 134
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 5666 (class 0 OID 0)
-- Dependencies: 11
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- TOC entry 5667 (class 0 OID 0)
-- Dependencies: 136
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- TOC entry 5668 (class 0 OID 0)
-- Dependencies: 33
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- TOC entry 5677 (class 0 OID 0)
-- Dependencies: 615
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- TOC entry 5678 (class 0 OID 0)
-- Dependencies: 663
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- TOC entry 5680 (class 0 OID 0)
-- Dependencies: 535
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- TOC entry 5682 (class 0 OID 0)
-- Dependencies: 568
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- TOC entry 5683 (class 0 OID 0)
-- Dependencies: 625
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- TOC entry 5684 (class 0 OID 0)
-- Dependencies: 708
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- TOC entry 5685 (class 0 OID 0)
-- Dependencies: 682
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- TOC entry 5686 (class 0 OID 0)
-- Dependencies: 655
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- TOC entry 5687 (class 0 OID 0)
-- Dependencies: 661
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5688 (class 0 OID 0)
-- Dependencies: 603
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5689 (class 0 OID 0)
-- Dependencies: 738
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- TOC entry 5690 (class 0 OID 0)
-- Dependencies: 689
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- TOC entry 5691 (class 0 OID 0)
-- Dependencies: 589
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5692 (class 0 OID 0)
-- Dependencies: 554
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5693 (class 0 OID 0)
-- Dependencies: 701
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- TOC entry 5694 (class 0 OID 0)
-- Dependencies: 542
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- TOC entry 5695 (class 0 OID 0)
-- Dependencies: 779
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- TOC entry 5696 (class 0 OID 0)
-- Dependencies: 775
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- TOC entry 5698 (class 0 OID 0)
-- Dependencies: 687
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- TOC entry 5700 (class 0 OID 0)
-- Dependencies: 654
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5702 (class 0 OID 0)
-- Dependencies: 601
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- TOC entry 5703 (class 0 OID 0)
-- Dependencies: 553
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5704 (class 0 OID 0)
-- Dependencies: 755
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- TOC entry 5705 (class 0 OID 0)
-- Dependencies: 716
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- TOC entry 5706 (class 0 OID 0)
-- Dependencies: 772
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- TOC entry 5707 (class 0 OID 0)
-- Dependencies: 696
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- TOC entry 5708 (class 0 OID 0)
-- Dependencies: 611
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- TOC entry 5709 (class 0 OID 0)
-- Dependencies: 605
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- TOC entry 5710 (class 0 OID 0)
-- Dependencies: 749
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5711 (class 0 OID 0)
-- Dependencies: 523
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5712 (class 0 OID 0)
-- Dependencies: 751
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 5713 (class 0 OID 0)
-- Dependencies: 557
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5714 (class 0 OID 0)
-- Dependencies: 763
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5715 (class 0 OID 0)
-- Dependencies: 758
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 5716 (class 0 OID 0)
-- Dependencies: 620
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- TOC entry 5717 (class 0 OID 0)
-- Dependencies: 612
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- TOC entry 5718 (class 0 OID 0)
-- Dependencies: 587
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5719 (class 0 OID 0)
-- Dependencies: 742
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5720 (class 0 OID 0)
-- Dependencies: 746
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- TOC entry 5721 (class 0 OID 0)
-- Dependencies: 616
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5722 (class 0 OID 0)
-- Dependencies: 750
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 5723 (class 0 OID 0)
-- Dependencies: 745
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5724 (class 0 OID 0)
-- Dependencies: 777
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- TOC entry 5725 (class 0 OID 0)
-- Dependencies: 638
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- TOC entry 5726 (class 0 OID 0)
-- Dependencies: 567
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 5727 (class 0 OID 0)
-- Dependencies: 752
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5728 (class 0 OID 0)
-- Dependencies: 521
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5729 (class 0 OID 0)
-- Dependencies: 718
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5731 (class 0 OID 0)
-- Dependencies: 547
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5732 (class 0 OID 0)
-- Dependencies: 622
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- TOC entry 5733 (class 0 OID 0)
-- Dependencies: 728
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- TOC entry 5734 (class 0 OID 0)
-- Dependencies: 522
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 5735 (class 0 OID 0)
-- Dependencies: 563
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- TOC entry 5736 (class 0 OID 0)
-- Dependencies: 584
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 5737 (class 0 OID 0)
-- Dependencies: 684
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- TOC entry 5738 (class 0 OID 0)
-- Dependencies: 588
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- TOC entry 5739 (class 0 OID 0)
-- Dependencies: 753
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- TOC entry 5740 (class 0 OID 0)
-- Dependencies: 673
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- TOC entry 5741 (class 0 OID 0)
-- Dependencies: 686
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- TOC entry 5742 (class 0 OID 0)
-- Dependencies: 756
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- TOC entry 5743 (class 0 OID 0)
-- Dependencies: 617
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- TOC entry 5744 (class 0 OID 0)
-- Dependencies: 598
-- Name: FUNCTION actualizar_dias_pipeline(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.actualizar_dias_pipeline() TO anon;
GRANT ALL ON FUNCTION public.actualizar_dias_pipeline() TO authenticated;
GRANT ALL ON FUNCTION public.actualizar_dias_pipeline() TO service_role;


--
-- TOC entry 5745 (class 0 OID 0)
-- Dependencies: 551
-- Name: FUNCTION actualizar_fecha_modificacion(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.actualizar_fecha_modificacion() TO anon;
GRANT ALL ON FUNCTION public.actualizar_fecha_modificacion() TO authenticated;
GRANT ALL ON FUNCTION public.actualizar_fecha_modificacion() TO service_role;


--
-- TOC entry 5746 (class 0 OID 0)
-- Dependencies: 695
-- Name: FUNCTION actualizar_stock_pedido(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.actualizar_stock_pedido() TO anon;
GRANT ALL ON FUNCTION public.actualizar_stock_pedido() TO authenticated;
GRANT ALL ON FUNCTION public.actualizar_stock_pedido() TO service_role;


--
-- TOC entry 5747 (class 0 OID 0)
-- Dependencies: 577
-- Name: FUNCTION actualizar_timestamp_cotizacion(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.actualizar_timestamp_cotizacion() TO anon;
GRANT ALL ON FUNCTION public.actualizar_timestamp_cotizacion() TO authenticated;
GRANT ALL ON FUNCTION public.actualizar_timestamp_cotizacion() TO service_role;


--
-- TOC entry 5748 (class 0 OID 0)
-- Dependencies: 733
-- Name: FUNCTION asegurar_principal_unico(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.asegurar_principal_unico() TO anon;
GRANT ALL ON FUNCTION public.asegurar_principal_unico() TO authenticated;
GRANT ALL ON FUNCTION public.asegurar_principal_unico() TO service_role;


--
-- TOC entry 5749 (class 0 OID 0)
-- Dependencies: 697
-- Name: FUNCTION asociar_marca_categoria(p_id_marca bigint, p_id_categoria bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.asociar_marca_categoria(p_id_marca bigint, p_id_categoria bigint) TO anon;
GRANT ALL ON FUNCTION public.asociar_marca_categoria(p_id_marca bigint, p_id_categoria bigint) TO authenticated;
GRANT ALL ON FUNCTION public.asociar_marca_categoria(p_id_marca bigint, p_id_categoria bigint) TO service_role;


--
-- TOC entry 5750 (class 0 OID 0)
-- Dependencies: 629
-- Name: FUNCTION auto_generar_numero_factura(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.auto_generar_numero_factura() TO anon;
GRANT ALL ON FUNCTION public.auto_generar_numero_factura() TO authenticated;
GRANT ALL ON FUNCTION public.auto_generar_numero_factura() TO service_role;


--
-- TOC entry 5751 (class 0 OID 0)
-- Dependencies: 741
-- Name: FUNCTION calcular_dias_vencimiento(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calcular_dias_vencimiento() TO anon;
GRANT ALL ON FUNCTION public.calcular_dias_vencimiento() TO authenticated;
GRANT ALL ON FUNCTION public.calcular_dias_vencimiento() TO service_role;


--
-- TOC entry 5752 (class 0 OID 0)
-- Dependencies: 649
-- Name: FUNCTION calcular_precio_multimoneda_automatico(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calcular_precio_multimoneda_automatico() TO anon;
GRANT ALL ON FUNCTION public.calcular_precio_multimoneda_automatico() TO authenticated;
GRANT ALL ON FUNCTION public.calcular_precio_multimoneda_automatico() TO service_role;


--
-- TOC entry 5753 (class 0 OID 0)
-- Dependencies: 613
-- Name: FUNCTION calcular_precio_venta_automatico(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calcular_precio_venta_automatico() TO anon;
GRANT ALL ON FUNCTION public.calcular_precio_venta_automatico() TO authenticated;
GRANT ALL ON FUNCTION public.calcular_precio_venta_automatico() TO service_role;


--
-- TOC entry 5754 (class 0 OID 0)
-- Dependencies: 538
-- Name: FUNCTION cotizaciones_en_riesgo(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cotizaciones_en_riesgo() TO anon;
GRANT ALL ON FUNCTION public.cotizaciones_en_riesgo() TO authenticated;
GRANT ALL ON FUNCTION public.cotizaciones_en_riesgo() TO service_role;


--
-- TOC entry 5755 (class 0 OID 0)
-- Dependencies: 645
-- Name: FUNCTION establecer_precio_producto(p_sku bigint, p_id_moneda bigint, p_precio_venta numeric, p_margen_aplicado numeric, p_usuario_id bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.establecer_precio_producto(p_sku bigint, p_id_moneda bigint, p_precio_venta numeric, p_margen_aplicado numeric, p_usuario_id bigint) TO anon;
GRANT ALL ON FUNCTION public.establecer_precio_producto(p_sku bigint, p_id_moneda bigint, p_precio_venta numeric, p_margen_aplicado numeric, p_usuario_id bigint) TO authenticated;
GRANT ALL ON FUNCTION public.establecer_precio_producto(p_sku bigint, p_id_moneda bigint, p_precio_venta numeric, p_margen_aplicado numeric, p_usuario_id bigint) TO service_role;


--
-- TOC entry 5756 (class 0 OID 0)
-- Dependencies: 722
-- Name: FUNCTION fn_registrar_primera_transicion(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.fn_registrar_primera_transicion() TO anon;
GRANT ALL ON FUNCTION public.fn_registrar_primera_transicion() TO authenticated;
GRANT ALL ON FUNCTION public.fn_registrar_primera_transicion() TO service_role;


--
-- TOC entry 5757 (class 0 OID 0)
-- Dependencies: 699
-- Name: FUNCTION fn_registrar_transicion_estado_cotizacion(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.fn_registrar_transicion_estado_cotizacion() TO anon;
GRANT ALL ON FUNCTION public.fn_registrar_transicion_estado_cotizacion() TO authenticated;
GRANT ALL ON FUNCTION public.fn_registrar_transicion_estado_cotizacion() TO service_role;


--
-- TOC entry 5758 (class 0 OID 0)
-- Dependencies: 727
-- Name: FUNCTION generar_codigo_solicitud(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generar_codigo_solicitud() TO anon;
GRANT ALL ON FUNCTION public.generar_codigo_solicitud() TO authenticated;
GRANT ALL ON FUNCTION public.generar_codigo_solicitud() TO service_role;


--
-- TOC entry 5759 (class 0 OID 0)
-- Dependencies: 658
-- Name: FUNCTION get_auth_info(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_auth_info() TO anon;
GRANT ALL ON FUNCTION public.get_auth_info() TO authenticated;
GRANT ALL ON FUNCTION public.get_auth_info() TO service_role;


--
-- TOC entry 5760 (class 0 OID 0)
-- Dependencies: 581
-- Name: FUNCTION get_margen_principal(p_sku bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_margen_principal(p_sku bigint) TO anon;
GRANT ALL ON FUNCTION public.get_margen_principal(p_sku bigint) TO authenticated;
GRANT ALL ON FUNCTION public.get_margen_principal(p_sku bigint) TO service_role;


--
-- TOC entry 5761 (class 0 OID 0)
-- Dependencies: 630
-- Name: FUNCTION get_precio_principal(p_sku bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_precio_principal(p_sku bigint) TO anon;
GRANT ALL ON FUNCTION public.get_precio_principal(p_sku bigint) TO authenticated;
GRANT ALL ON FUNCTION public.get_precio_principal(p_sku bigint) TO service_role;


--
-- TOC entry 5762 (class 0 OID 0)
-- Dependencies: 731
-- Name: FUNCTION obtener_precio_producto(p_sku bigint, p_id_moneda bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.obtener_precio_producto(p_sku bigint, p_id_moneda bigint) TO anon;
GRANT ALL ON FUNCTION public.obtener_precio_producto(p_sku bigint, p_id_moneda bigint) TO authenticated;
GRANT ALL ON FUNCTION public.obtener_precio_producto(p_sku bigint, p_id_moneda bigint) TO service_role;


--
-- TOC entry 5763 (class 0 OID 0)
-- Dependencies: 626
-- Name: FUNCTION obtener_tasa_conversion(estado_origen_codigo character varying, estado_destino_codigo character varying, fecha_desde date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.obtener_tasa_conversion(estado_origen_codigo character varying, estado_destino_codigo character varying, fecha_desde date) TO anon;
GRANT ALL ON FUNCTION public.obtener_tasa_conversion(estado_origen_codigo character varying, estado_destino_codigo character varying, fecha_desde date) TO authenticated;
GRANT ALL ON FUNCTION public.obtener_tasa_conversion(estado_origen_codigo character varying, estado_destino_codigo character varying, fecha_desde date) TO service_role;


--
-- TOC entry 5764 (class 0 OID 0)
-- Dependencies: 619
-- Name: FUNCTION recalcular_precios_masivo(p_filtro_categoria bigint, p_filtro_proveedor bigint, p_nuevo_tipo_cambio numeric, p_usuario_id bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.recalcular_precios_masivo(p_filtro_categoria bigint, p_filtro_proveedor bigint, p_nuevo_tipo_cambio numeric, p_usuario_id bigint) TO anon;
GRANT ALL ON FUNCTION public.recalcular_precios_masivo(p_filtro_categoria bigint, p_filtro_proveedor bigint, p_nuevo_tipo_cambio numeric, p_usuario_id bigint) TO authenticated;
GRANT ALL ON FUNCTION public.recalcular_precios_masivo(p_filtro_categoria bigint, p_filtro_proveedor bigint, p_nuevo_tipo_cambio numeric, p_usuario_id bigint) TO service_role;


--
-- TOC entry 5765 (class 0 OID 0)
-- Dependencies: 659
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- TOC entry 5766 (class 0 OID 0)
-- Dependencies: 760
-- Name: FUNCTION validar_margen_producto(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.validar_margen_producto() TO anon;
GRANT ALL ON FUNCTION public.validar_margen_producto() TO authenticated;
GRANT ALL ON FUNCTION public.validar_margen_producto() TO service_role;


--
-- TOC entry 5767 (class 0 OID 0)
-- Dependencies: 518
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 5768 (class 0 OID 0)
-- Dependencies: 767
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- TOC entry 5769 (class 0 OID 0)
-- Dependencies: 618
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- TOC entry 5770 (class 0 OID 0)
-- Dependencies: 735
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- TOC entry 5771 (class 0 OID 0)
-- Dependencies: 564
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- TOC entry 5772 (class 0 OID 0)
-- Dependencies: 579
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- TOC entry 5773 (class 0 OID 0)
-- Dependencies: 560
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 5774 (class 0 OID 0)
-- Dependencies: 769
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- TOC entry 5775 (class 0 OID 0)
-- Dependencies: 573
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- TOC entry 5776 (class 0 OID 0)
-- Dependencies: 714
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- TOC entry 5777 (class 0 OID 0)
-- Dependencies: 533
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- TOC entry 5778 (class 0 OID 0)
-- Dependencies: 685
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- TOC entry 5779 (class 0 OID 0)
-- Dependencies: 571
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- TOC entry 5780 (class 0 OID 0)
-- Dependencies: 546
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 5781 (class 0 OID 0)
-- Dependencies: 653
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 5783 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- TOC entry 5785 (class 0 OID 0)
-- Dependencies: 373
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- TOC entry 5788 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- TOC entry 5790 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- TOC entry 5792 (class 0 OID 0)
-- Dependencies: 368
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- TOC entry 5794 (class 0 OID 0)
-- Dependencies: 367
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- TOC entry 5796 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- TOC entry 5797 (class 0 OID 0)
-- Dependencies: 495
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- TOC entry 5798 (class 0 OID 0)
-- Dependencies: 374
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- TOC entry 5800 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- TOC entry 5802 (class 0 OID 0)
-- Dependencies: 353
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- TOC entry 5804 (class 0 OID 0)
-- Dependencies: 371
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- TOC entry 5806 (class 0 OID 0)
-- Dependencies: 372
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- TOC entry 5810 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- TOC entry 5812 (class 0 OID 0)
-- Dependencies: 370
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- TOC entry 5815 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- TOC entry 5818 (class 0 OID 0)
-- Dependencies: 352
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- TOC entry 5819 (class 0 OID 0)
-- Dependencies: 351
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- TOC entry 5820 (class 0 OID 0)
-- Dependencies: 350
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- TOC entry 5821 (class 0 OID 0)
-- Dependencies: 481
-- Name: TABLE carrito_compra; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.carrito_compra TO anon;
GRANT ALL ON TABLE public.carrito_compra TO authenticated;
GRANT ALL ON TABLE public.carrito_compra TO service_role;


--
-- TOC entry 5823 (class 0 OID 0)
-- Dependencies: 480
-- Name: SEQUENCE carrito_compra_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.carrito_compra_id_seq TO anon;
GRANT ALL ON SEQUENCE public.carrito_compra_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.carrito_compra_id_seq TO service_role;


--
-- TOC entry 5824 (class 0 OID 0)
-- Dependencies: 408
-- Name: TABLE categoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.categoria TO anon;
GRANT ALL ON TABLE public.categoria TO authenticated;
GRANT ALL ON TABLE public.categoria TO service_role;


--
-- TOC entry 5826 (class 0 OID 0)
-- Dependencies: 407
-- Name: SEQUENCE categoria_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.categoria_id_seq TO anon;
GRANT ALL ON SEQUENCE public.categoria_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.categoria_id_seq TO service_role;


--
-- TOC entry 5827 (class 0 OID 0)
-- Dependencies: 390
-- Name: TABLE ciudad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ciudad TO anon;
GRANT ALL ON TABLE public.ciudad TO authenticated;
GRANT ALL ON TABLE public.ciudad TO service_role;


--
-- TOC entry 5829 (class 0 OID 0)
-- Dependencies: 389
-- Name: SEQUENCE ciudad_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.ciudad_id_seq TO anon;
GRANT ALL ON SEQUENCE public.ciudad_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.ciudad_id_seq TO service_role;


--
-- TOC entry 5831 (class 0 OID 0)
-- Dependencies: 419
-- Name: TABLE cliente; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cliente TO anon;
GRANT ALL ON TABLE public.cliente TO authenticated;
GRANT ALL ON TABLE public.cliente TO service_role;


--
-- TOC entry 5833 (class 0 OID 0)
-- Dependencies: 418
-- Name: SEQUENCE cliente_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cliente_id_seq TO anon;
GRANT ALL ON SEQUENCE public.cliente_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.cliente_id_seq TO service_role;


--
-- TOC entry 5834 (class 0 OID 0)
-- Dependencies: 425
-- Name: TABLE recogedores; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recogedores TO anon;
GRANT ALL ON TABLE public.recogedores TO authenticated;
GRANT ALL ON TABLE public.recogedores TO service_role;


--
-- TOC entry 5835 (class 0 OID 0)
-- Dependencies: 412
-- Name: TABLE vehicle_types; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vehicle_types TO anon;
GRANT ALL ON TABLE public.vehicle_types TO authenticated;
GRANT ALL ON TABLE public.vehicle_types TO service_role;


--
-- TOC entry 5836 (class 0 OID 0)
-- Dependencies: 488
-- Name: TABLE collector_details; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.collector_details TO anon;
GRANT ALL ON TABLE public.collector_details TO authenticated;
GRANT ALL ON TABLE public.collector_details TO service_role;


--
-- TOC entry 5837 (class 0 OID 0)
-- Dependencies: 448
-- Name: TABLE comunicacion_solicitud; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.comunicacion_solicitud TO anon;
GRANT ALL ON TABLE public.comunicacion_solicitud TO authenticated;
GRANT ALL ON TABLE public.comunicacion_solicitud TO service_role;


--
-- TOC entry 5839 (class 0 OID 0)
-- Dependencies: 447
-- Name: SEQUENCE comunicacion_solicitud_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.comunicacion_solicitud_id_seq TO anon;
GRANT ALL ON SEQUENCE public.comunicacion_solicitud_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.comunicacion_solicitud_id_seq TO service_role;


--
-- TOC entry 5840 (class 0 OID 0)
-- Dependencies: 404
-- Name: TABLE condiciones_comerciales; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.condiciones_comerciales TO anon;
GRANT ALL ON TABLE public.condiciones_comerciales TO authenticated;
GRANT ALL ON TABLE public.condiciones_comerciales TO service_role;


--
-- TOC entry 5842 (class 0 OID 0)
-- Dependencies: 403
-- Name: SEQUENCE condiciones_comerciales_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.condiciones_comerciales_id_seq TO anon;
GRANT ALL ON SEQUENCE public.condiciones_comerciales_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.condiciones_comerciales_id_seq TO service_role;


--
-- TOC entry 5843 (class 0 OID 0)
-- Dependencies: 427
-- Name: TABLE configuracion_archivos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.configuracion_archivos TO anon;
GRANT ALL ON TABLE public.configuracion_archivos TO authenticated;
GRANT ALL ON TABLE public.configuracion_archivos TO service_role;


--
-- TOC entry 5844 (class 0 OID 0)
-- Dependencies: 429
-- Name: TABLE configuracion_fe; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.configuracion_fe TO anon;
GRANT ALL ON TABLE public.configuracion_fe TO authenticated;
GRANT ALL ON TABLE public.configuracion_fe TO service_role;


--
-- TOC entry 5846 (class 0 OID 0)
-- Dependencies: 428
-- Name: SEQUENCE configuracion_fe_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.configuracion_fe_id_seq TO anon;
GRANT ALL ON SEQUENCE public.configuracion_fe_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.configuracion_fe_id_seq TO service_role;


--
-- TOC entry 5847 (class 0 OID 0)
-- Dependencies: 426
-- Name: TABLE configuracion_sistema; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.configuracion_sistema TO anon;
GRANT ALL ON TABLE public.configuracion_sistema TO authenticated;
GRANT ALL ON TABLE public.configuracion_sistema TO service_role;


--
-- TOC entry 5848 (class 0 OID 0)
-- Dependencies: 485
-- Name: TABLE costos_operativos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.costos_operativos TO anon;
GRANT ALL ON TABLE public.costos_operativos TO authenticated;
GRANT ALL ON TABLE public.costos_operativos TO service_role;


--
-- TOC entry 5850 (class 0 OID 0)
-- Dependencies: 484
-- Name: SEQUENCE costos_operativos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.costos_operativos_id_seq TO anon;
GRANT ALL ON SEQUENCE public.costos_operativos_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.costos_operativos_id_seq TO service_role;


--
-- TOC entry 5853 (class 0 OID 0)
-- Dependencies: 461
-- Name: TABLE cotizacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cotizacion TO anon;
GRANT ALL ON TABLE public.cotizacion TO authenticated;
GRANT ALL ON TABLE public.cotizacion TO service_role;


--
-- TOC entry 5854 (class 0 OID 0)
-- Dependencies: 463
-- Name: TABLE cotizacion_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cotizacion_detalle TO anon;
GRANT ALL ON TABLE public.cotizacion_detalle TO authenticated;
GRANT ALL ON TABLE public.cotizacion_detalle TO service_role;


--
-- TOC entry 5856 (class 0 OID 0)
-- Dependencies: 462
-- Name: SEQUENCE cotizacion_detalle_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cotizacion_detalle_id_seq TO anon;
GRANT ALL ON SEQUENCE public.cotizacion_detalle_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.cotizacion_detalle_id_seq TO service_role;


--
-- TOC entry 5858 (class 0 OID 0)
-- Dependencies: 460
-- Name: SEQUENCE cotizacion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cotizacion_id_seq TO anon;
GRANT ALL ON SEQUENCE public.cotizacion_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.cotizacion_id_seq TO service_role;


--
-- TOC entry 5859 (class 0 OID 0)
-- Dependencies: 457
-- Name: TABLE crm_actividad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_actividad TO anon;
GRANT ALL ON TABLE public.crm_actividad TO authenticated;
GRANT ALL ON TABLE public.crm_actividad TO service_role;


--
-- TOC entry 5861 (class 0 OID 0)
-- Dependencies: 456
-- Name: SEQUENCE crm_actividad_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.crm_actividad_id_seq TO anon;
GRANT ALL ON SEQUENCE public.crm_actividad_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.crm_actividad_id_seq TO service_role;


--
-- TOC entry 5862 (class 0 OID 0)
-- Dependencies: 414
-- Name: TABLE crm_etapa; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_etapa TO anon;
GRANT ALL ON TABLE public.crm_etapa TO authenticated;
GRANT ALL ON TABLE public.crm_etapa TO service_role;


--
-- TOC entry 5864 (class 0 OID 0)
-- Dependencies: 413
-- Name: SEQUENCE crm_etapa_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.crm_etapa_id_seq TO anon;
GRANT ALL ON SEQUENCE public.crm_etapa_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.crm_etapa_id_seq TO service_role;


--
-- TOC entry 5865 (class 0 OID 0)
-- Dependencies: 459
-- Name: TABLE crm_nota; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_nota TO anon;
GRANT ALL ON TABLE public.crm_nota TO authenticated;
GRANT ALL ON TABLE public.crm_nota TO service_role;


--
-- TOC entry 5867 (class 0 OID 0)
-- Dependencies: 458
-- Name: SEQUENCE crm_nota_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.crm_nota_id_seq TO anon;
GRANT ALL ON SEQUENCE public.crm_nota_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.crm_nota_id_seq TO service_role;


--
-- TOC entry 5868 (class 0 OID 0)
-- Dependencies: 479
-- Name: TABLE crowdlending_operacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crowdlending_operacion TO anon;
GRANT ALL ON TABLE public.crowdlending_operacion TO authenticated;
GRANT ALL ON TABLE public.crowdlending_operacion TO service_role;


--
-- TOC entry 5870 (class 0 OID 0)
-- Dependencies: 478
-- Name: SEQUENCE crowdlending_operacion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.crowdlending_operacion_id_seq TO anon;
GRANT ALL ON SEQUENCE public.crowdlending_operacion_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.crowdlending_operacion_id_seq TO service_role;


--
-- TOC entry 5871 (class 0 OID 0)
-- Dependencies: 473
-- Name: TABLE cuenta_por_cobrar; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_por_cobrar TO anon;
GRANT ALL ON TABLE public.cuenta_por_cobrar TO authenticated;
GRANT ALL ON TABLE public.cuenta_por_cobrar TO service_role;


--
-- TOC entry 5873 (class 0 OID 0)
-- Dependencies: 472
-- Name: SEQUENCE cuenta_por_cobrar_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cuenta_por_cobrar_id_seq TO anon;
GRANT ALL ON SEQUENCE public.cuenta_por_cobrar_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.cuenta_por_cobrar_id_seq TO service_role;


--
-- TOC entry 5874 (class 0 OID 0)
-- Dependencies: 453
-- Name: TABLE detalle_solicitud_cotizacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.detalle_solicitud_cotizacion TO anon;
GRANT ALL ON TABLE public.detalle_solicitud_cotizacion TO authenticated;
GRANT ALL ON TABLE public.detalle_solicitud_cotizacion TO service_role;


--
-- TOC entry 5876 (class 0 OID 0)
-- Dependencies: 452
-- Name: SEQUENCE detalle_solicitud_cotizacion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.detalle_solicitud_cotizacion_id_seq TO anon;
GRANT ALL ON SEQUENCE public.detalle_solicitud_cotizacion_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.detalle_solicitud_cotizacion_id_seq TO service_role;


--
-- TOC entry 5877 (class 0 OID 0)
-- Dependencies: 444
-- Name: TABLE direccion_cliente; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.direccion_cliente TO anon;
GRANT ALL ON TABLE public.direccion_cliente TO authenticated;
GRANT ALL ON TABLE public.direccion_cliente TO service_role;


--
-- TOC entry 5879 (class 0 OID 0)
-- Dependencies: 443
-- Name: SEQUENCE direccion_cliente_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.direccion_cliente_id_seq TO anon;
GRANT ALL ON SEQUENCE public.direccion_cliente_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.direccion_cliente_id_seq TO service_role;


--
-- TOC entry 5880 (class 0 OID 0)
-- Dependencies: 398
-- Name: TABLE disponibilidad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.disponibilidad TO anon;
GRANT ALL ON TABLE public.disponibilidad TO authenticated;
GRANT ALL ON TABLE public.disponibilidad TO service_role;


--
-- TOC entry 5882 (class 0 OID 0)
-- Dependencies: 397
-- Name: SEQUENCE disponibilidad_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.disponibilidad_id_seq TO anon;
GRANT ALL ON SEQUENCE public.disponibilidad_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.disponibilidad_id_seq TO service_role;


--
-- TOC entry 5883 (class 0 OID 0)
-- Dependencies: 392
-- Name: TABLE distrito; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.distrito TO anon;
GRANT ALL ON TABLE public.distrito TO authenticated;
GRANT ALL ON TABLE public.distrito TO service_role;


--
-- TOC entry 5884 (class 0 OID 0)
-- Dependencies: 391
-- Name: SEQUENCE distrito_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.distrito_id_seq TO anon;
GRANT ALL ON SEQUENCE public.distrito_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.distrito_id_seq TO service_role;


--
-- TOC entry 5885 (class 0 OID 0)
-- Dependencies: 421
-- Name: TABLE empresa_emisora; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.empresa_emisora TO anon;
GRANT ALL ON TABLE public.empresa_emisora TO authenticated;
GRANT ALL ON TABLE public.empresa_emisora TO service_role;


--
-- TOC entry 5887 (class 0 OID 0)
-- Dependencies: 420
-- Name: SEQUENCE empresa_emisora_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.empresa_emisora_id_seq TO anon;
GRANT ALL ON SEQUENCE public.empresa_emisora_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.empresa_emisora_id_seq TO service_role;


--
-- TOC entry 5888 (class 0 OID 0)
-- Dependencies: 498
-- Name: TABLE estado_cotizacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.estado_cotizacion TO anon;
GRANT ALL ON TABLE public.estado_cotizacion TO authenticated;
GRANT ALL ON TABLE public.estado_cotizacion TO service_role;


--
-- TOC entry 5890 (class 0 OID 0)
-- Dependencies: 497
-- Name: SEQUENCE estado_cotizacion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.estado_cotizacion_id_seq TO anon;
GRANT ALL ON SEQUENCE public.estado_cotizacion_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.estado_cotizacion_id_seq TO service_role;


--
-- TOC entry 5891 (class 0 OID 0)
-- Dependencies: 477
-- Name: TABLE factoring_operacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.factoring_operacion TO anon;
GRANT ALL ON TABLE public.factoring_operacion TO authenticated;
GRANT ALL ON TABLE public.factoring_operacion TO service_role;


--
-- TOC entry 5893 (class 0 OID 0)
-- Dependencies: 476
-- Name: SEQUENCE factoring_operacion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.factoring_operacion_id_seq TO anon;
GRANT ALL ON SEQUENCE public.factoring_operacion_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.factoring_operacion_id_seq TO service_role;


--
-- TOC entry 5894 (class 0 OID 0)
-- Dependencies: 469
-- Name: TABLE factura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.factura TO anon;
GRANT ALL ON TABLE public.factura TO authenticated;
GRANT ALL ON TABLE public.factura TO service_role;


--
-- TOC entry 5895 (class 0 OID 0)
-- Dependencies: 471
-- Name: TABLE factura_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.factura_detalle TO anon;
GRANT ALL ON TABLE public.factura_detalle TO authenticated;
GRANT ALL ON TABLE public.factura_detalle TO service_role;


--
-- TOC entry 5897 (class 0 OID 0)
-- Dependencies: 470
-- Name: SEQUENCE factura_detalle_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.factura_detalle_id_seq TO anon;
GRANT ALL ON SEQUENCE public.factura_detalle_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.factura_detalle_id_seq TO service_role;


--
-- TOC entry 5899 (class 0 OID 0)
-- Dependencies: 468
-- Name: SEQUENCE factura_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.factura_id_seq TO anon;
GRANT ALL ON SEQUENCE public.factura_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.factura_id_seq TO service_role;


--
-- TOC entry 5900 (class 0 OID 0)
-- Dependencies: 402
-- Name: TABLE forma_pago; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forma_pago TO anon;
GRANT ALL ON TABLE public.forma_pago TO authenticated;
GRANT ALL ON TABLE public.forma_pago TO service_role;


--
-- TOC entry 5902 (class 0 OID 0)
-- Dependencies: 401
-- Name: SEQUENCE forma_pago_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.forma_pago_id_seq TO anon;
GRANT ALL ON SEQUENCE public.forma_pago_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.forma_pago_id_seq TO service_role;


--
-- TOC entry 5903 (class 0 OID 0)
-- Dependencies: 483
-- Name: TABLE historial_precios; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.historial_precios TO anon;
GRANT ALL ON TABLE public.historial_precios TO authenticated;
GRANT ALL ON TABLE public.historial_precios TO service_role;


--
-- TOC entry 5905 (class 0 OID 0)
-- Dependencies: 482
-- Name: SEQUENCE historial_precios_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.historial_precios_id_seq TO anon;
GRANT ALL ON SEQUENCE public.historial_precios_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.historial_precios_id_seq TO service_role;


--
-- TOC entry 5906 (class 0 OID 0)
-- Dependencies: 487
-- Name: TABLE inversion_categoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inversion_categoria TO anon;
GRANT ALL ON TABLE public.inversion_categoria TO authenticated;
GRANT ALL ON TABLE public.inversion_categoria TO service_role;


--
-- TOC entry 5908 (class 0 OID 0)
-- Dependencies: 486
-- Name: SEQUENCE inversion_categoria_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.inversion_categoria_id_seq TO anon;
GRANT ALL ON SEQUENCE public.inversion_categoria_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.inversion_categoria_id_seq TO service_role;


--
-- TOC entry 5909 (class 0 OID 0)
-- Dependencies: 410
-- Name: TABLE marca; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.marca TO anon;
GRANT ALL ON TABLE public.marca TO authenticated;
GRANT ALL ON TABLE public.marca TO service_role;


--
-- TOC entry 5910 (class 0 OID 0)
-- Dependencies: 430
-- Name: TABLE marca_categoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.marca_categoria TO anon;
GRANT ALL ON TABLE public.marca_categoria TO authenticated;
GRANT ALL ON TABLE public.marca_categoria TO service_role;


--
-- TOC entry 5912 (class 0 OID 0)
-- Dependencies: 409
-- Name: SEQUENCE marca_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.marca_id_seq TO anon;
GRANT ALL ON SEQUENCE public.marca_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.marca_id_seq TO service_role;


--
-- TOC entry 5913 (class 0 OID 0)
-- Dependencies: 386
-- Name: TABLE moneda; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.moneda TO anon;
GRANT ALL ON TABLE public.moneda TO authenticated;
GRANT ALL ON TABLE public.moneda TO service_role;


--
-- TOC entry 5915 (class 0 OID 0)
-- Dependencies: 385
-- Name: SEQUENCE moneda_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.moneda_id_seq TO anon;
GRANT ALL ON SEQUENCE public.moneda_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.moneda_id_seq TO service_role;


--
-- TOC entry 5916 (class 0 OID 0)
-- Dependencies: 455
-- Name: TABLE oportunidad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.oportunidad TO anon;
GRANT ALL ON TABLE public.oportunidad TO authenticated;
GRANT ALL ON TABLE public.oportunidad TO service_role;


--
-- TOC entry 5918 (class 0 OID 0)
-- Dependencies: 454
-- Name: SEQUENCE oportunidad_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.oportunidad_id_seq TO anon;
GRANT ALL ON SEQUENCE public.oportunidad_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.oportunidad_id_seq TO service_role;


--
-- TOC entry 5919 (class 0 OID 0)
-- Dependencies: 475
-- Name: TABLE pago_recibido; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pago_recibido TO anon;
GRANT ALL ON TABLE public.pago_recibido TO authenticated;
GRANT ALL ON TABLE public.pago_recibido TO service_role;


--
-- TOC entry 5921 (class 0 OID 0)
-- Dependencies: 474
-- Name: SEQUENCE pago_recibido_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.pago_recibido_id_seq TO anon;
GRANT ALL ON SEQUENCE public.pago_recibido_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.pago_recibido_id_seq TO service_role;


--
-- TOC entry 5922 (class 0 OID 0)
-- Dependencies: 388
-- Name: TABLE pais; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pais TO anon;
GRANT ALL ON TABLE public.pais TO authenticated;
GRANT ALL ON TABLE public.pais TO service_role;


--
-- TOC entry 5924 (class 0 OID 0)
-- Dependencies: 387
-- Name: SEQUENCE pais_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.pais_id_seq TO anon;
GRANT ALL ON SEQUENCE public.pais_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.pais_id_seq TO service_role;


--
-- TOC entry 5925 (class 0 OID 0)
-- Dependencies: 465
-- Name: TABLE pedido; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pedido TO anon;
GRANT ALL ON TABLE public.pedido TO authenticated;
GRANT ALL ON TABLE public.pedido TO service_role;


--
-- TOC entry 5926 (class 0 OID 0)
-- Dependencies: 467
-- Name: TABLE pedido_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pedido_detalle TO anon;
GRANT ALL ON TABLE public.pedido_detalle TO authenticated;
GRANT ALL ON TABLE public.pedido_detalle TO service_role;


--
-- TOC entry 5928 (class 0 OID 0)
-- Dependencies: 466
-- Name: SEQUENCE pedido_detalle_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.pedido_detalle_id_seq TO anon;
GRANT ALL ON SEQUENCE public.pedido_detalle_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.pedido_detalle_id_seq TO service_role;


--
-- TOC entry 5930 (class 0 OID 0)
-- Dependencies: 464
-- Name: SEQUENCE pedido_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.pedido_id_seq TO anon;
GRANT ALL ON SEQUENCE public.pedido_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.pedido_id_seq TO service_role;


--
-- TOC entry 5931 (class 0 OID 0)
-- Dependencies: 451
-- Name: TABLE procesamiento_archivo_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.procesamiento_archivo_log TO anon;
GRANT ALL ON TABLE public.procesamiento_archivo_log TO authenticated;
GRANT ALL ON TABLE public.procesamiento_archivo_log TO service_role;


--
-- TOC entry 5933 (class 0 OID 0)
-- Dependencies: 450
-- Name: SEQUENCE procesamiento_archivo_log_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.procesamiento_archivo_log_id_seq TO anon;
GRANT ALL ON SEQUENCE public.procesamiento_archivo_log_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.procesamiento_archivo_log_id_seq TO service_role;


--
-- TOC entry 5936 (class 0 OID 0)
-- Dependencies: 434
-- Name: TABLE producto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.producto TO anon;
GRANT ALL ON TABLE public.producto TO authenticated;
GRANT ALL ON TABLE public.producto TO service_role;


--
-- TOC entry 5937 (class 0 OID 0)
-- Dependencies: 515
-- Name: TABLE producto_precio_moneda; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.producto_precio_moneda TO anon;
GRANT ALL ON TABLE public.producto_precio_moneda TO authenticated;
GRANT ALL ON TABLE public.producto_precio_moneda TO service_role;


--
-- TOC entry 5939 (class 0 OID 0)
-- Dependencies: 514
-- Name: SEQUENCE producto_precio_moneda_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.producto_precio_moneda_id_seq TO anon;
GRANT ALL ON SEQUENCE public.producto_precio_moneda_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.producto_precio_moneda_id_seq TO service_role;


--
-- TOC entry 5942 (class 0 OID 0)
-- Dependencies: 436
-- Name: TABLE producto_proveedor; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.producto_proveedor TO anon;
GRANT ALL ON TABLE public.producto_proveedor TO authenticated;
GRANT ALL ON TABLE public.producto_proveedor TO service_role;


--
-- TOC entry 5944 (class 0 OID 0)
-- Dependencies: 435
-- Name: SEQUENCE producto_proveedor_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.producto_proveedor_id_seq TO anon;
GRANT ALL ON SEQUENCE public.producto_proveedor_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.producto_proveedor_id_seq TO service_role;


--
-- TOC entry 5946 (class 0 OID 0)
-- Dependencies: 433
-- Name: SEQUENCE producto_sku_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.producto_sku_seq TO anon;
GRANT ALL ON SEQUENCE public.producto_sku_seq TO authenticated;
GRANT ALL ON SEQUENCE public.producto_sku_seq TO service_role;


--
-- TOC entry 5947 (class 0 OID 0)
-- Dependencies: 438
-- Name: TABLE promocion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.promocion TO anon;
GRANT ALL ON TABLE public.promocion TO authenticated;
GRANT ALL ON TABLE public.promocion TO service_role;


--
-- TOC entry 5948 (class 0 OID 0)
-- Dependencies: 440
-- Name: TABLE promocion_descuento; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.promocion_descuento TO anon;
GRANT ALL ON TABLE public.promocion_descuento TO authenticated;
GRANT ALL ON TABLE public.promocion_descuento TO service_role;


--
-- TOC entry 5950 (class 0 OID 0)
-- Dependencies: 439
-- Name: SEQUENCE promocion_descuento_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.promocion_descuento_id_seq TO anon;
GRANT ALL ON SEQUENCE public.promocion_descuento_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.promocion_descuento_id_seq TO service_role;


--
-- TOC entry 5952 (class 0 OID 0)
-- Dependencies: 437
-- Name: SEQUENCE promocion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.promocion_id_seq TO anon;
GRANT ALL ON SEQUENCE public.promocion_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.promocion_id_seq TO service_role;


--
-- TOC entry 5953 (class 0 OID 0)
-- Dependencies: 442
-- Name: TABLE promocion_uso; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.promocion_uso TO anon;
GRANT ALL ON TABLE public.promocion_uso TO authenticated;
GRANT ALL ON TABLE public.promocion_uso TO service_role;


--
-- TOC entry 5955 (class 0 OID 0)
-- Dependencies: 441
-- Name: SEQUENCE promocion_uso_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.promocion_uso_id_seq TO anon;
GRANT ALL ON SEQUENCE public.promocion_uso_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.promocion_uso_id_seq TO service_role;


--
-- TOC entry 5957 (class 0 OID 0)
-- Dependencies: 423
-- Name: TABLE proveedor; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.proveedor TO anon;
GRANT ALL ON TABLE public.proveedor TO authenticated;
GRANT ALL ON TABLE public.proveedor TO service_role;


--
-- TOC entry 5958 (class 0 OID 0)
-- Dependencies: 432
-- Name: TABLE proveedor_categoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.proveedor_categoria TO anon;
GRANT ALL ON TABLE public.proveedor_categoria TO authenticated;
GRANT ALL ON TABLE public.proveedor_categoria TO service_role;


--
-- TOC entry 5960 (class 0 OID 0)
-- Dependencies: 422
-- Name: SEQUENCE proveedor_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.proveedor_id_seq TO anon;
GRANT ALL ON SEQUENCE public.proveedor_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.proveedor_id_seq TO service_role;


--
-- TOC entry 5961 (class 0 OID 0)
-- Dependencies: 431
-- Name: TABLE proveedor_marca; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.proveedor_marca TO anon;
GRANT ALL ON TABLE public.proveedor_marca TO authenticated;
GRANT ALL ON TABLE public.proveedor_marca TO service_role;


--
-- TOC entry 5962 (class 0 OID 0)
-- Dependencies: 424
-- Name: SEQUENCE recogedores_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.recogedores_id_seq TO anon;
GRANT ALL ON SEQUENCE public.recogedores_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.recogedores_id_seq TO service_role;


--
-- TOC entry 5963 (class 0 OID 0)
-- Dependencies: 394
-- Name: TABLE rol; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rol TO anon;
GRANT ALL ON TABLE public.rol TO authenticated;
GRANT ALL ON TABLE public.rol TO service_role;


--
-- TOC entry 5965 (class 0 OID 0)
-- Dependencies: 393
-- Name: SEQUENCE rol_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.rol_id_seq TO anon;
GRANT ALL ON SEQUENCE public.rol_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.rol_id_seq TO service_role;


--
-- TOC entry 5966 (class 0 OID 0)
-- Dependencies: 406
-- Name: TABLE rubro; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rubro TO anon;
GRANT ALL ON TABLE public.rubro TO authenticated;
GRANT ALL ON TABLE public.rubro TO service_role;


--
-- TOC entry 5968 (class 0 OID 0)
-- Dependencies: 405
-- Name: SEQUENCE rubro_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.rubro_id_seq TO anon;
GRANT ALL ON SEQUENCE public.rubro_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.rubro_id_seq TO service_role;


--
-- TOC entry 5969 (class 0 OID 0)
-- Dependencies: 449
-- Name: TABLE solicitud_archivo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.solicitud_archivo TO anon;
GRANT ALL ON TABLE public.solicitud_archivo TO authenticated;
GRANT ALL ON TABLE public.solicitud_archivo TO service_role;


--
-- TOC entry 5972 (class 0 OID 0)
-- Dependencies: 446
-- Name: TABLE solicitud_cotizacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.solicitud_cotizacion TO anon;
GRANT ALL ON TABLE public.solicitud_cotizacion TO authenticated;
GRANT ALL ON TABLE public.solicitud_cotizacion TO service_role;


--
-- TOC entry 5974 (class 0 OID 0)
-- Dependencies: 445
-- Name: SEQUENCE solicitud_cotizacion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.solicitud_cotizacion_id_seq TO anon;
GRANT ALL ON SEQUENCE public.solicitud_cotizacion_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.solicitud_cotizacion_id_seq TO service_role;


--
-- TOC entry 5975 (class 0 OID 0)
-- Dependencies: 396
-- Name: TABLE tipo_cliente; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_cliente TO anon;
GRANT ALL ON TABLE public.tipo_cliente TO authenticated;
GRANT ALL ON TABLE public.tipo_cliente TO service_role;


--
-- TOC entry 5976 (class 0 OID 0)
-- Dependencies: 384
-- Name: SEQUENCE tipo_cliente_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tipo_cliente_id_seq TO anon;
GRANT ALL ON SEQUENCE public.tipo_cliente_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.tipo_cliente_id_seq TO service_role;


--
-- TOC entry 5978 (class 0 OID 0)
-- Dependencies: 395
-- Name: SEQUENCE tipo_cliente_id_seq1; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tipo_cliente_id_seq1 TO anon;
GRANT ALL ON SEQUENCE public.tipo_cliente_id_seq1 TO authenticated;
GRANT ALL ON SEQUENCE public.tipo_cliente_id_seq1 TO service_role;


--
-- TOC entry 5979 (class 0 OID 0)
-- Dependencies: 500
-- Name: TABLE tipo_contacto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_contacto TO anon;
GRANT ALL ON TABLE public.tipo_contacto TO authenticated;
GRANT ALL ON TABLE public.tipo_contacto TO service_role;


--
-- TOC entry 5981 (class 0 OID 0)
-- Dependencies: 499
-- Name: SEQUENCE tipo_contacto_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tipo_contacto_id_seq TO anon;
GRANT ALL ON SEQUENCE public.tipo_contacto_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.tipo_contacto_id_seq TO service_role;


--
-- TOC entry 5982 (class 0 OID 0)
-- Dependencies: 502
-- Name: TABLE transicion_estado_cotizacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transicion_estado_cotizacion TO anon;
GRANT ALL ON TABLE public.transicion_estado_cotizacion TO authenticated;
GRANT ALL ON TABLE public.transicion_estado_cotizacion TO service_role;


--
-- TOC entry 5984 (class 0 OID 0)
-- Dependencies: 501
-- Name: SEQUENCE transicion_estado_cotizacion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.transicion_estado_cotizacion_id_seq TO anon;
GRANT ALL ON SEQUENCE public.transicion_estado_cotizacion_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.transicion_estado_cotizacion_id_seq TO service_role;


--
-- TOC entry 5985 (class 0 OID 0)
-- Dependencies: 400
-- Name: TABLE unidad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.unidad TO anon;
GRANT ALL ON TABLE public.unidad TO authenticated;
GRANT ALL ON TABLE public.unidad TO service_role;


--
-- TOC entry 5987 (class 0 OID 0)
-- Dependencies: 399
-- Name: SEQUENCE unidad_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.unidad_id_seq TO anon;
GRANT ALL ON SEQUENCE public.unidad_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.unidad_id_seq TO service_role;


--
-- TOC entry 5988 (class 0 OID 0)
-- Dependencies: 415
-- Name: TABLE usuario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.usuario TO anon;
GRANT ALL ON TABLE public.usuario TO authenticated;
GRANT ALL ON TABLE public.usuario TO service_role;


--
-- TOC entry 5989 (class 0 OID 0)
-- Dependencies: 417
-- Name: TABLE usuario_rol; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.usuario_rol TO anon;
GRANT ALL ON TABLE public.usuario_rol TO authenticated;
GRANT ALL ON TABLE public.usuario_rol TO service_role;


--
-- TOC entry 5991 (class 0 OID 0)
-- Dependencies: 416
-- Name: SEQUENCE usuario_rol_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.usuario_rol_id_seq TO anon;
GRANT ALL ON SEQUENCE public.usuario_rol_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.usuario_rol_id_seq TO service_role;


--
-- TOC entry 5992 (class 0 OID 0)
-- Dependencies: 505
-- Name: TABLE v_analisis_perdidas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_analisis_perdidas TO anon;
GRANT ALL ON TABLE public.v_analisis_perdidas TO authenticated;
GRANT ALL ON TABLE public.v_analisis_perdidas TO service_role;


--
-- TOC entry 5993 (class 0 OID 0)
-- Dependencies: 496
-- Name: TABLE v_analisis_precios_calculados; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_analisis_precios_calculados TO anon;
GRANT ALL ON TABLE public.v_analisis_precios_calculados TO authenticated;
GRANT ALL ON TABLE public.v_analisis_precios_calculados TO service_role;


--
-- TOC entry 5994 (class 0 OID 0)
-- Dependencies: 506
-- Name: TABLE v_ciclo_vida_cotizaciones; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_ciclo_vida_cotizaciones TO anon;
GRANT ALL ON TABLE public.v_ciclo_vida_cotizaciones TO authenticated;
GRANT ALL ON TABLE public.v_ciclo_vida_cotizaciones TO service_role;


--
-- TOC entry 5995 (class 0 OID 0)
-- Dependencies: 491
-- Name: TABLE v_cobranza_pendiente; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_cobranza_pendiente TO anon;
GRANT ALL ON TABLE public.v_cobranza_pendiente TO authenticated;
GRANT ALL ON TABLE public.v_cobranza_pendiente TO service_role;


--
-- TOC entry 5996 (class 0 OID 0)
-- Dependencies: 489
-- Name: TABLE v_historial_precios_detallado; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_historial_precios_detallado TO anon;
GRANT ALL ON TABLE public.v_historial_precios_detallado TO authenticated;
GRANT ALL ON TABLE public.v_historial_precios_detallado TO service_role;


--
-- TOC entry 5997 (class 0 OID 0)
-- Dependencies: 504
-- Name: TABLE v_performance_asesores_embudo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_performance_asesores_embudo TO anon;
GRANT ALL ON TABLE public.v_performance_asesores_embudo TO authenticated;
GRANT ALL ON TABLE public.v_performance_asesores_embudo TO service_role;


--
-- TOC entry 5998 (class 0 OID 0)
-- Dependencies: 490
-- Name: TABLE v_pipeline_crm; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_pipeline_crm TO anon;
GRANT ALL ON TABLE public.v_pipeline_crm TO authenticated;
GRANT ALL ON TABLE public.v_pipeline_crm TO service_role;


--
-- TOC entry 5999 (class 0 OID 0)
-- Dependencies: 516
-- Name: TABLE v_producto_compatibilidad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_producto_compatibilidad TO anon;
GRANT ALL ON TABLE public.v_producto_compatibilidad TO authenticated;
GRANT ALL ON TABLE public.v_producto_compatibilidad TO service_role;


--
-- TOC entry 6000 (class 0 OID 0)
-- Dependencies: 492
-- Name: TABLE v_solicitudes_pendientes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_solicitudes_pendientes TO anon;
GRANT ALL ON TABLE public.v_solicitudes_pendientes TO authenticated;
GRANT ALL ON TABLE public.v_solicitudes_pendientes TO service_role;


--
-- TOC entry 6001 (class 0 OID 0)
-- Dependencies: 503
-- Name: TABLE v_transiciones_por_estado; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_transiciones_por_estado TO anon;
GRANT ALL ON TABLE public.v_transiciones_por_estado TO authenticated;
GRANT ALL ON TABLE public.v_transiciones_por_estado TO service_role;


--
-- TOC entry 6002 (class 0 OID 0)
-- Dependencies: 411
-- Name: SEQUENCE vehicle_types_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.vehicle_types_id_seq TO anon;
GRANT ALL ON SEQUENCE public.vehicle_types_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.vehicle_types_id_seq TO service_role;


--
-- TOC entry 6003 (class 0 OID 0)
-- Dependencies: 383
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- TOC entry 6004 (class 0 OID 0)
-- Dependencies: 507
-- Name: TABLE messages_2025_09_22; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_09_22 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_09_22 TO dashboard_user;


--
-- TOC entry 6005 (class 0 OID 0)
-- Dependencies: 508
-- Name: TABLE messages_2025_09_23; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_09_23 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_09_23 TO dashboard_user;


--
-- TOC entry 6006 (class 0 OID 0)
-- Dependencies: 509
-- Name: TABLE messages_2025_09_24; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_09_24 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_09_24 TO dashboard_user;


--
-- TOC entry 6007 (class 0 OID 0)
-- Dependencies: 510
-- Name: TABLE messages_2025_09_25; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_09_25 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_09_25 TO dashboard_user;


--
-- TOC entry 6008 (class 0 OID 0)
-- Dependencies: 511
-- Name: TABLE messages_2025_09_26; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_09_26 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_09_26 TO dashboard_user;


--
-- TOC entry 6009 (class 0 OID 0)
-- Dependencies: 512
-- Name: TABLE messages_2025_09_27; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_09_27 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_09_27 TO dashboard_user;


--
-- TOC entry 6010 (class 0 OID 0)
-- Dependencies: 513
-- Name: TABLE messages_2025_09_28; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2025_09_28 TO postgres;
GRANT ALL ON TABLE realtime.messages_2025_09_28 TO dashboard_user;


--
-- TOC entry 6011 (class 0 OID 0)
-- Dependencies: 375
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- TOC entry 6012 (class 0 OID 0)
-- Dependencies: 380
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- TOC entry 6013 (class 0 OID 0)
-- Dependencies: 379
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- TOC entry 6015 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- TOC entry 6016 (class 0 OID 0)
-- Dependencies: 494
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- TOC entry 6018 (class 0 OID 0)
-- Dependencies: 359
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- TOC entry 6019 (class 0 OID 0)
-- Dependencies: 493
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- TOC entry 6020 (class 0 OID 0)
-- Dependencies: 376
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- TOC entry 6021 (class 0 OID 0)
-- Dependencies: 377
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- TOC entry 6022 (class 0 OID 0)
-- Dependencies: 361
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- TOC entry 6023 (class 0 OID 0)
-- Dependencies: 362
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- TOC entry 3026 (class 826 OID 16603)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 3027 (class 826 OID 16604)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 3025 (class 826 OID 16602)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 3036 (class 826 OID 16682)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- TOC entry 3035 (class 826 OID 16681)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- TOC entry 3034 (class 826 OID 16680)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- TOC entry 3039 (class 826 OID 16637)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 3038 (class 826 OID 16636)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 3037 (class 826 OID 16635)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 3031 (class 826 OID 16617)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 3033 (class 826 OID 16616)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 3032 (class 826 OID 16615)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 3042 (class 826 OID 73238)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 3041 (class 826 OID 73237)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 3040 (class 826 OID 73236)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 3029 (class 826 OID 16607)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 3030 (class 826 OID 16608)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 3028 (class 826 OID 16606)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 3024 (class 826 OID 16545)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 3023 (class 826 OID 16544)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 3022 (class 826 OID 16543)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 4209 (class 3466 OID 16621)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- TOC entry 4214 (class 3466 OID 16700)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- TOC entry 4208 (class 3466 OID 16619)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- TOC entry 4215 (class 3466 OID 16703)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- TOC entry 4210 (class 3466 OID 16622)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- TOC entry 4211 (class 3466 OID 16623)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

-- Completed on 2025-09-30 11:56:25

--
-- PostgreSQL database dump complete
--

