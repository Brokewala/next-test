export function hashId(id: number): string {
    const str = id.toString();
    const salt = "my_random_salt"; // Ajoutez un sel pour plus de sécurité

    // Constantes pour FNV-1a
    const FNV_PRIME = 16777619;
    const FNV_OFFSET_BASIS = 2166136261;

    let hash = FNV_OFFSET_BASIS;

    // Concaténer l'entrée avec le sel
    const input = str + salt;

    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i); // XOR avec l'octet courant
        hash *= FNV_PRIME; // Multiplication par le nombre premier FNV
    }

    // Convertir en base 36 et tronquer à 10 caractères
    return Math.abs(hash).toString(36).padEnd(10, 'x').substring(0, 10);
}