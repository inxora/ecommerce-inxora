# Endpoint backend: POST /api/pagos/crear-token-monto

El frontend llama a este endpoint cuando el usuario selecciona "Tarjeta" (Izipay) como método de pago, **antes** de hacer submit del formulario. Así el widget de Izipay se muestra inmediatamente.

## Request

```json
POST /api/pagos/crear-token-monto
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "monto": 150.50
}
```

- `monto`: número (float) - total a cobrar (subtotal + envío)

## Response

```json
{
  "success": true,
  "data": {
    "formToken": "token_para_izipay_widget",
    "publicKey": "clave_publica_izipay"
  }
}
```

## Ejemplo de implementación (FastAPI)

```python
@router.post("/crear-token-monto")
async def crear_token_monto(
    body: CrearTokenMontoBody,
    cliente_id: int = Depends(get_current_cliente)
):
    """
    Crea un formToken de Izipay usando solo el monto,
    sin necesitar un pedido creado previamente.
    Útil para mostrar el widget antes del submit.
    """
    form_token = await izipay_service.crear_form_token(
        amount=int(body.monto * 100),  # en céntimos
        order_id=f"PREVIEW-{cliente_id}-{int(time.time())}",
        customer_email="checkout@inxora.com"  # email genérico o del cliente
    )
    return {
        "success": True,
        "data": {
            "formToken": form_token,
            "publicKey": settings.IZIPAY_PUBLIC_KEY
        }
    }

class CrearTokenMontoBody(BaseModel):
    monto: float
```

## Nota sobre validación

Cuando el usuario paga en el widget, el frontend llama a `POST /api/pagos/validar` con `kr_answer` y `kr_hash`. El backend debe poder asociar ese pago con el pedido real que se creó después. Si el token se generó con `PREVIEW-*`, el backend podría necesitar lógica adicional para vincular el pago con el pedido real (por ejemplo, por sesión o por el último pedido del cliente).
