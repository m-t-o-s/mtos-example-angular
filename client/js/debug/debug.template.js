<form>
  <textarea ng-model="debug.data"></textarea>
  <button ng-click="debug.save()">save</button>
</form>
<ul>
  <li ng-repeat="torrent in debug.webTorrent.client.torrents">
    <p>{{torrent.name}}</p>
    <ul>
      <li ng-repeat="file in torrent.files">
        <p>{{file.name}}</p>
      </li>
    </ul>
  </li>
</ul>