#!/bin/bash

bracket="=============================================" 

# Fungsi untuk memutar file suara
play_sound() {
    local volume="$1"
    local sound_file="$2"
    ffplay -nodisp -loglevel quiet -af "volume=$volume" -autoexit "$sound_file" >/dev/null 2>&1
}

# Periksa apakah ada parameter yang dimasukkan
if [ $# -eq 0 ]; then
    echo "Penggunaan: $0 <pesan_commit>"
    play_sound 0.4 "./sound/error.mp3"
    exit 1
fi

# Pengecekan apakah saat ini ada di branch master
main_branch=$(git rev-parse --abbrev-ref HEAD)
echo ""
echo "$bracket"
echo -e "Sekarang sedang di Branch: \e[32m$main_branch\e[0m"
if [ "$main_branch" != "master" ]; then
    echo "Skrip harus dijalankan dari branch master."
    play_sound 0.4 "./sound/error.mp3"
    git checkout master
    exit 1
fi
play_sound 0.4 "./sound/start-script.mp3"

# Tambahkan semua perubahan, commit dengan pesan yang diberikan, dan push ke branch saat ini
echo -e "Push ke Branch: \e[32m$main_branch\e[0m"
git add .
git commit -m "$*"
build_output=$(git pull 2>&1)
if echo "$build_output" | grep -qi "CONFLICT"; then
    echo "$bracket"
    echo "# Kode ada yang konflik broo !!"
    echo ""
    echo "$build_output"
    play_sound 1 "./sound/error.mp3"
    exit 1
fi
git push origin $main_branch

# Daftar semua branch kecuali master
for branch in $(git branch | grep -v "master"); do
    # Melakukan loop pada setiap branch, kecuali master
    echo ""
    echo "$bracket"
    echo -e "Sedang di Branch: \e[32m$branch\e[0m" # \e[32m digunakan untuk warna hijau, \e[0m untuk mereset warna
    play_sound 0.4 "./sound/select-branch.mp3"

    git checkout $branch
    sleep 1
    echo ""
    pull_message=$(git pull)
    if [ "$pull_message" = "Already up to date." ]; then
        echo -e "Branch \e[32m$branch\e[0m tidak ada perubahan!"
    else
        echo -e "Ada perubahan existing di Branch: \e[32m$branch\e[0m"
        echo $pull_message
    fi
    sleep 2
    echo ""
    # Periksa konflik
    if git merge master origin/$branch; then
        echo ""
        git push
    else
        echo "Konflik terdeteksi pada branch $branch. Berhenti."
        play_sound 0.4 "./sound/error.mp3"
        exit 1
    fi
    echo ""
    echo -e "Sukses merge ke Branch: \e[32m$branch\e[0m"
    play_sound 0.4 "./sound/success.mp3"
done

echo "$bracket"
echo "Sukses sinkronisasi ke semua branch!"
echo -e "Kembali ke Branch: \e[32m$main_branch\e[0m"
play_sound 0.4 "./sound/finish.mp3"

# Kembali ke branch utama
git checkout $main_branch

echo "$bracket" # Exit...
