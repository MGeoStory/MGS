import { Component, OnChanges, OnDestroy } from '@angular/core';
import { MapGraphService } from 'app/shared/map-graph.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'post-receipt-content',
    styleUrls: ['content.component.css'],
    templateUrl: 'content.component.html'
}) export class ContentComponent implements OnDestroy {
    subscription: Subscription;
    id = 'sss1';

    constructor(private mgs: MapGraphService) {
        this.subscription = mgs.refCountry$.subscribe(
            id => {
                this.id = id;
            }
        )
    }
    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    }

}