export function textoDeError(fallo, textos) {
  if (fallo?.sinConexion) return textos?.estados?.sinConexion?.texto;
  return (fallo?.codigo && textos?.errores?.[fallo.codigo]) || textos?.errores?.generico;
}