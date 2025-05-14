<?php
$zipFile = 'app.zip';

if (!file_exists($zipFile)) {
    echo "Fichier ZIP non trouvé.";
    exit;
}

$zip = new ZipArchive;
if ($zip->open($zipFile) === TRUE) {
    $zip->extractTo('.');
    $zip->close();
    unlink($zipFile); // Supprime le ZIP après extraction
    unlink(__FILE__); // Supprime le script PHP après exécution
    echo "Déploiement terminé avec succès.";
} else {
    echo "Erreur lors de l'extraction du fichier ZIP.";
}
?>
