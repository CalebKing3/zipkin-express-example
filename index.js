// index.js﻿
﻿const fork = require('child_process').fork;


// fork creates a new node process
fork('./name_service.js');
fork('./first_name_service.js');
fork('./last_name_service.js');