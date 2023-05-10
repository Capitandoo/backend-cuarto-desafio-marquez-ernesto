import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = dirname (fileURLToPath (import.meta.url));
export const pathProducts = __dirname + "/data/productos.json";
export const pathCarritos = __dirname + "/data/carrito.json";
