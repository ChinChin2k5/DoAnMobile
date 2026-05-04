# Tạo folder đúng theo đường dẫn Expo yêu cầu
$dest = "dist\assets\node_modules\@expo\vector-icons\build\vendor\react-native-vector-icons\Fonts"
New-Item -ItemType Directory -Force -Path $dest

$src = "node_modules\@expo\vector-icons\build\vendor\react-native-vector-icons\Fonts"

# Copy và đổi tên theo hash đúng
Copy-Item "$src\Feather.ttf"           "$dest\Feather.ca4b48e04dc1ce10bfbddb262c8b835f.ttf"
Copy-Item "$src\FontAwesome5_Solid.ttf"  "$dest\FontAwesome5_Solid.605ed7926cf39a2ad5ec2d1f9d391d3d.ttf"
Copy-Item "$src\FontAwesome5_Brands.ttf" "$dest\FontAwesome5_Brands.3b89dd103490708d19a95adcae52210e.ttf"
Copy-Item "$src\FontAwesome5_Regular.ttf" "$dest\FontAwesome5_Regular.1f77739ca9ff2188b539c36f30ffa2be.ttf"
Copy-Item "$src\Ionicons.ttf"           "$dest\Ionicons.b4eb097d35f44ed943676fd56f6bdc51.ttf"

Write-Host "Done! Deploy lại bằng: firebase deploy --only hosting"