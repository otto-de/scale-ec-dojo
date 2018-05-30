import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITeam } from 'app/shared/model/team.model';
import { TeamsSelectionService } from 'app/teams/teams-selection/teams-selection.service';
import { Comment, IComment } from 'app/shared/model/comment.model';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { CommentService } from 'app/entities/comment';
import { IAchievableSkill } from 'app/shared/model/achievable-skill.model';
import 'simplebar';

@Component({
    selector: 'jhi-skill-details-comments',
    templateUrl: './skill-details-comments.component.html',
    styleUrls: ['./skill-details-comments.scss']
})
export class SkillDetailsCommentsComponent implements OnInit {
    @Input() selectedTeam: ITeam;
    @Input() teams: ITeam[];
    @Input() achievableSkill: IAchievableSkill;
    @Input() comments: IComment[];
    @Output() onCommentSubmitted = new EventEmitter<IComment>();
    newComment: IComment;

    constructor(private commentService: CommentService) {}

    ngOnInit() {
        this.newComment = new Comment();
    }

    isActiveTeam(comment: IComment) {
        return this.selectedTeam && comment && this.selectedTeam.id === comment.teamId;
    }

    onSubmit() {
        this.newComment.creationDate = moment();
        this.newComment.skillId = this.achievableSkill ? this.achievableSkill.skillId : undefined;
        this.newComment.skillTitle = this.achievableSkill ? this.achievableSkill.title : undefined;
        this.newComment.teamId = this.selectedTeam ? this.selectedTeam.id : undefined;
        this.newComment.teamShortName = this.selectedTeam ? this.selectedTeam.shortName : undefined;
        this.commentService.create(this.newComment).subscribe((res: HttpResponse<IComment>) => {
            if (res.body) {
                this.newComment = new Comment();
                this.onCommentSubmitted.emit(res.body);
            }
        });
    }
}
