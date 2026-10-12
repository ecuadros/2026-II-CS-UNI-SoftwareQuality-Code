package pe.quebradasegura.riesgo.lugares;

public record LugarDto(
        String id,
        String usuarioId,
        String nombre,
        TipoLugar tipo,
        String ubigeo,
        double latitud,
        double longitud) {

    static LugarDto de(Lugar lugar) {
        return new LugarDto(lugar.id(), lugar.usuarioId(), lugar.nombre(), lugar.tipo(), lugar.ubigeo(),
                lugar.ubicacion().getY(), lugar.ubicacion().getX());
    }
}